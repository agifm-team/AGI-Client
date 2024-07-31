import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';

import { ClientEvent, RoomStateEvent } from 'matrix-js-sdk';

import Modal from 'react-bootstrap/Modal';
import objectHash from 'object-hash';
import { objType } from 'for-promise/utils/lib.mjs';

import { getAppearance } from '@src/util/libs/appearance';
import settings from '@src/client/state/settings';
import { AvatarJquery } from '@src/app/atoms/avatar/Avatar';

import tinyAPI from '../../../util/mods';
import initMatrix from '../../../client/initMatrix';
import cons from '../../../client/state/cons';
import navigation from '../../../client/state/navigation';

import ScrollView from '../../atoms/scroll/ScrollView';

import DrawerHeader from './DrawerHeader';
import DrawerBreadcrumb from './DrawerBreadcrumb';
import Home from './Home';
import Directs from './Directs';

import IconButton from '../../atoms/button/IconButton';

import { useForceUpdate } from '../../hooks/useForceUpdate';
import { useSelectedTab } from '../../hooks/useSelectedTab';
import { useSelectedSpace } from '../../hooks/useSelectedSpace';
import { getSelectRoom, getSelectSpace } from '../../../util/selectedRoom';
import { getCurrentState } from '../../../util/matrixUtil';
import { selectRoomMode } from '../../../client/action/navigation';
import { setLoadingPage } from '../../templates/client/Loading';
import PonyRoomEvent from '../space-settings/PonyRoomEvent';

// System State
function useSystemState() {
  // Data
  const [systemState, setSystemState] = useState({ status: null, value: null });
  const [oldSystemState, setOldSystemState] = useState({ status: null, value: null });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // State Check
    const handleSystemState = (state) => {
      if (!isRefreshing) {
        if (state === 'ERROR' || state === 'RECONNECTING' || state === 'STOPPED') {
          const tinyStatus = { status: 'Connection lost!', value: state };
          tinyAPI.emit('systemState', tinyStatus);
          setSystemState(tinyStatus);
        }

        if (systemState !== null && systemState.status !== null) {
          const tinyStatus = { status: null, value: state };
          tinyAPI.emit('systemState', tinyStatus);
          setSystemState(tinyStatus);
        }
      }
    };

    // Detect recover from reconnect
    if (
      !getAppearance('noReconnectRefresh') &&
      (oldSystemState.value === 'ERROR' ||
        oldSystemState.value === 'RECONNECTING' ||
        oldSystemState.value === 'STOPPED')
    ) {
      if (
        __ENV_APP__.ELECTRON_MODE &&
        objType(global.useLoadingElectron, 'object') &&
        typeof global.useLoadingElectron.appendLoading === 'function'
      ) {
        global.useLoadingElectron.appendLoading();
      } else {
        $('body').empty();
        setLoadingPage('Refreshing...');
      }

      setIsRefreshing(true);

      window.location.reload();
    }

    // Insert new old
    if (objectHash(systemState) !== objectHash(oldSystemState)) setOldSystemState(systemState);

    // Sync
    initMatrix.matrixClient.on(ClientEvent.Sync, handleSystemState);
    return () => {
      initMatrix.matrixClient.removeListener(ClientEvent.Sync, handleSystemState);
    };
  }, [systemState]);

  // Complete
  return [systemState];
}

// Drawer
function Drawer() {
  const [systemState] = useSystemState();
  const [selectedTab] = useSelectedTab();
  const [spaceId] = useSelectedSpace();
  const [, forceUpdate] = useForceUpdate();
  const scrollRef = useRef(null);

  const [bannerSrc, setBannerSrc] = useState('');
  const spaceDrawerRef = useRef(null);
  const homeClickRef = useRef(null);

  const [isIconsColored, setIsIconsColored] = useState(settings.isSelectedThemeColored());
  settings.isThemeColoredDetector(useEffect, setIsIconsColored);

  const { roomList } = initMatrix;

  useEffect(() => {
    const handleUpdate = () => {
      forceUpdate();
    };
    roomList.on(cons.events.roomList.ROOMLIST_UPDATED, handleUpdate);
    return () => {
      roomList.removeListener(cons.events.roomList.ROOMLIST_UPDATED, handleUpdate);
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    });
  }, [selectedTab]);

  const mx = initMatrix.matrixClient;
  const mxcUrl = initMatrix.mxcUrl;
  const room = mx.getRoom(spaceId);

  useEffect(() => {
    if (room) {
      const bannerCfg =
        getCurrentState(room).getStateEvents(PonyRoomEvent.PhSettings, 'banner')?.getContent() ??
        {};

      if (bannerCfg && typeof bannerCfg?.url === 'string' && bannerCfg?.url.length > 0) {
        const bannerData = AvatarJquery({
          isObj: true,
          imageSrc: mxcUrl.toHttp(bannerCfg.url, 960, 540),
          imageAnimSrc: mxcUrl.toHttp(bannerCfg.url),
          onLoadingChange: () => {
            if (typeof bannerData.blobAnimSrc === 'string' && bannerData.blobAnimSrc.length > 0) {
              setBannerSrc(bannerData.blobAnimSrc);
            }
          },
        });
      } else {
        setBannerSrc('');
      }
    } else {
      setBannerSrc('');
    }

    const handleEvent = (event, state, prevEvent) => {
      if (room && event.getRoomId() !== room.roomId) return;
      if (event.getType() !== PonyRoomEvent.PhSettings) return;
      if (event.getStateKey() !== 'banner') return;

      const oldUrl = prevEvent?.getContent()?.url;
      const newUrl = event.getContent()?.url;

      if (!oldUrl || !newUrl || newUrl !== oldUrl) {
        setBannerSrc(mxcUrl.toHttp(newUrl, 960, 540));
      }
    };

    mx.on(RoomStateEvent.Events, handleEvent);
    return () => {
      mx.removeListener(RoomStateEvent.Events, handleEvent);
    };
  });

  return (
    <>
      <div
        ref={spaceDrawerRef}
        className={`space-drawer-body${bannerSrc ? ' drawer-with-banner' : ''}`}
      >
        <DrawerHeader selectedTab={selectedTab} spaceId={spaceId} banner={bannerSrc} room={room} />

        <ScrollView ref={scrollRef} autoHide>
          {navigation.selectedSpacePath.length > 1 && selectedTab !== cons.tabs.DIRECTS && (
            <DrawerBreadcrumb spaceId={spaceId} />
          )}

          {!spaceId ? (
            <center className="small text-start d-grid w-100">
              <IconButton
                neonColor
                iconColor={!isIconsColored ? null : 'rgb(164, 42, 212)'}
                ref={homeClickRef}
                fa="fa-solid fa-compass"
                id="space-drawer-home-button"
                className={`text-start mt-3 mx-3 space-drawer-menu-item${!getSelectRoom() && !getSelectSpace() ? ' active' : ''}`}
                onClick={() => {
                  global.resetRoomInfo();
                  selectRoomMode('room');
                  $(homeClickRef.current).addClass('active');
                }}
              >
                <span className="ms-3">Explore</span>
              </IconButton>
            </center>
          ) : null}

          {selectedTab !== cons.tabs.DIRECTS ? (
            <Home spaceId={spaceId} />
          ) : (
            <Directs size={roomList.directs.size} />
          )}
        </ScrollView>
      </div>

      {systemState !== null && systemState.status !== null ? (
        <Modal
          className={__ENV_APP__.ELECTRON_MODE ? 'root-electron-style' : null}
          backdropClassName={__ENV_APP__.ELECTRON_MODE ? 'root-electron-style' : null}
          dialogClassName="modal-dialog-centered modal-dialog-scrollable"
          show
        >
          <Modal.Header className="noselect">
            <Modal.Title className="h5">System Status</Modal.Title>
          </Modal.Header>
          <Modal.Body className="small">{systemState.status}</Modal.Body>
        </Modal>
      ) : null}
    </>
  );
}

export default Drawer;
