import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import objectHash from 'object-hash';
import EventEmitter from 'events';

import initMatrix from '../../client/initMatrix';
import { objType } from '../../util/tools';

// Emitter
class MatrixDevices extends EventEmitter {
  constructor() {
    super();
    this.devices = [];
  }

  updateDevices(devices) {
    if (Array.isArray(devices)) this.devices = devices;
  }

  getDevices() {
    return this.devices;
  }
}

const matrixDevices = new MatrixDevices();
const sendPing = () => {
  const mx = initMatrix.matrixClient;
  if (mx && typeof mx.getAccountData === 'function') {
    const eventData = mx.getAccountData('pony.house.ping');
    if (eventData) {
      const devices = matrixDevices.getDevices();
      const devicesData = eventData.getContent() ?? {};
      const hash = {};

      const deviceId = mx.getDeviceId();
      const newDevicesData = { pings: [] };
      try {
        if (objType(devicesData, 'object')) {
          hash.old = objectHash(devicesData);
        } else {
          hash.old = null;
        }
      } catch {
        hash.old = null;
      }

      if (objType(devicesData, 'object') && Array.isArray(devicesData.pings)) {
        for (const item in devicesData.pings) {
          if (
            objType(newDevicesData.pings[item], 'object') &&
            typeof newDevicesData.pings[item].id === 'string' &&
            devices.find((device) => device.device_id === newDevicesData.pings[item].id) &&
            typeof newDevicesData.pings[item].unix === 'number'
          ) {
            newDevicesData.pings.push({
              id: newDevicesData.pings[item].id,
              unix: newDevicesData.pings[item].unix,
            });
          }
        }
      }

      const deviceItem = newDevicesData.pings.find((item) => item.id === deviceId);
      if (deviceItem) {
        deviceItem.unix = moment().unix();
      } else {
        newDevicesData.pings.push({ id: deviceId, unix: moment().unix() });
      }

      try {
        hash.new = objectHash(newDevicesData);
      } catch {
        hash.new = null;
      }
      if (hash.new !== hash.old) {
        mx.setAccountData('pony.house.ping', newDevicesData);
        matrixDevices.emit('devicePing', newDevicesData.pings);
      }
    } else {
      setTimeout(sendPing, 200);
    }
  } else {
    setTimeout(sendPing, 200);
  }
};

// 10 Minutes later...
setTimeout(() => sendPing(), 60000 * 10);

// Export
let firstTime = true;
export { matrixDevices };
export function useDeviceList() {
  // Data
  const mx = initMatrix.matrixClient;
  const [deviceList, setDeviceList] = useState(null);

  // Effect
  useEffect(() => {
    let isMounted = true;

    // Start update
    const updateDevices = () =>
      mx.getDevices().then((data) => {
        if (!isMounted) return;

        const devices = data.devices || [];
        matrixDevices.updateDevices(devices);
        matrixDevices.emit('devicesUpdated', devices);

        if (firstTime) {
          firstTime = false;
          sendPing();
        }

        setDeviceList(devices);
      });

    // First check
    updateDevices();

    // Get update
    const handleDevicesUpdate = (users) => {
      if (users.includes(mx.getUserId())) {
        updateDevices();
      }
    };

    // Events
    const handleAccountData = (event) => {
      if (event.getType() === 'pony.house.ping') {
        const devicesData = mx.getAccountData('pony.house.ping').getContent() ?? {};
        matrixDevices.emit(
          'devicePing',
          objType(devicesData, 'object') && Array.isArray(devicesData.pings)
            ? devicesData.pings
            : [],
        );
      }
    };

    mx.on('accountData', handleAccountData);
    mx.on('crypto.devicesUpdated', handleDevicesUpdate);
    return () => {
      mx.removeListener('accountData', handleAccountData);
      mx.removeListener('crypto.devicesUpdated', handleDevicesUpdate);
      isMounted = false;
    };
  }, []);

  // Complete
  return deviceList;
}
