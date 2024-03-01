import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import EventEmitter from 'events';

// Emitter
class MobileEvents extends EventEmitter {
  constructor() {
    super();
    this.checkingNotificationPerm = false;
    this.allowNotifications = { display: null };

    const tinyThis = this;
    if (Capacitor.isNativePlatform()) {
      App.addListener('backButton', (data) => tinyThis.emit('backButton', data));

      App.addListener('appStateChange', (data) => tinyThis.emit('appStateChange', data));
      App.addListener('appStateChange', ({ isActive }) =>
        tinyThis.emit('appStateChangeIsActive', isActive),
      );

      App.addListener('appUrlOpen', (data) => tinyThis.emit('appUrlOpen', data));
      App.addListener('appRestoredResult', (data) => tinyThis.emit('appRestoredResult', data));

      if (__ENV_APP__.MODE === 'development') {
        App.addListener('appStateChange', ({ isActive }) => {
          console.log('[mobile] App state changed. Is active?', isActive);
        });

        App.addListener('appUrlOpen', (data) => {
          console.log('[mobile] App opened with URL:', data);
        });

        App.addListener('appRestoredResult', (data) => {
          console.log('[mobile] Restored state:', data);
        });
      }
    }
  }

  checkNotificationPerm() {
    const tinyThis = this;
    return new Promise((resolve, reject) => {
      if (!tinyThis.checkingNotificationPerm && Capacitor.isNativePlatform()) {
        tinyThis.checkingNotificationPerm = true;
        LocalNotifications.checkPermissions()
          .then(async (permStatus) => {
            tinyThis.allowNotifications = permStatus;
            if (tinyThis.allowNotifications.display === 'prompt') {
              tinyThis.allowNotifications = await LocalNotifications.requestPermissions();
            }

            if (tinyThis.allowNotifications.display !== 'granted') {
              tinyThis.checkingNotificationPerm = false;
              throw new Error('User denied mobile permissions!');
            }

            // return LocalNotifications.registerActionTypes({types: {}});
            tinyThis.checkingNotificationPerm = false;
            resolve(tinyThis.allowNotifications);
          })
          .catch((err) => {
            tinyThis.checkingNotificationPerm = false;
            reject(err);
          });
      }
    });
  }

  getNotificationPerm() {
    if (!Capacitor.isNativePlatform()) {
      return window.Notification?.permission;
    }
    return this.allowNotifications.display;
  }
}

const mobileEvents = new MobileEvents();
mobileEvents.setMaxListeners(Infinity);

export function isMobile(isNative = false) {
  if (!isNative) {
    return (
      Capacitor.isNativePlatform() ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }
  return Capacitor.isNativePlatform();
}

export function notificationStatus() {
  if (!Capacitor.isNativePlatform() && window.Notification?.permission) {
    return window.Notification?.permission;
  }
  if (Capacitor.isNativePlatform() && mobileEvents.allowNotifications.display) {
    return mobileEvents.allowNotifications.display;
  }

  return null;
}

export function noNotification() {
  return !Capacitor.isNativePlatform() && window.Notification === undefined;
}

export function requestNotification() {
  if (!Capacitor.isNativePlatform()) {
    return window.Notification.requestPermission();
  }
  if (Capacitor.isNativePlatform()) {
    return mobileEvents.checkNotificationPerm();
  }

  return null;
}

export default mobileEvents;
