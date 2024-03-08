import React from 'react';
import { btModal, objType } from '@src/util/tools';

import initMatrix from '@src/client/initMatrix';
import RawIcon from '@src/app/atoms/system-icons/RawIcon';

import { setLoadingPage } from '@src/app/templates/client/Loading';
// import { selectRoom, selectRoomMode, selectTab } from '@src/client/action/navigation';

// import { join } from '@src/client/action/room';

import jReact from '../../lib/jReact';
import { serverDomain } from '../socket';
import { clickAIButton } from './click';

/* const openRoom = (roomId) => {

    const mx = initMatrix.matrixClient;
    const room = mx.getRoom(roomId);

    if (!room) return;
    if (room.isSpaceRoom()) selectTab(roomId);

    else {
        selectRoomMode('room');
        selectRoom(roomId);
    }

}; */

const createButton = (id, title, icon) =>
  jReact(
    <button
      className={['sidebar-avatar', 'position-relative'].join(' ')}
      title={title}
      id={`agi-${id}`}
      type="button"
    >
      <div className="avatar-container avatar-container__normal  noselect">
        <span style={{ backgroundColor: 'transparent' }} className="avatar__border--active">
          <RawIcon fa={icon} />
        </span>
      </div>
    </button>,
  );

export function addRoomOptions(dt, roomType) {
  // Room Options list
  const roomOptions = $('#room-options');

  // Add Special Button
  let botsMenu = roomOptions.find('#agi-bots-menu').remove();
  if (roomType === 'room') {
    // Prepare Button
    botsMenu = jReact(
      <li className="nav-item" id="agi-bots-menu">
        <button
          title="Add AI"
          className={[
            'btn',
            'ic-btn',
            'ic-btn-link',
            'btn-bg',
            'btn-link',
            'btn-bg',
            'btn-text-link',
            'btn-bg',
            'nav-link',
            'border-0',
          ].join(' ')}
          tabIndex={0}
          type="button"
        >
          <RawIcon fa="bi bi-lightbulb-fill" />
        </button>
      </li>,
    );

    // Bot List button
    botsMenu.find('> button').tooltip({ placement: 'bottom' }).on('click', clickAIButton);

    // Append
    roomOptions.prepend(botsMenu);
  }
}

export default async function buttons() {
  setLoadingPage();

  const pidData = await initMatrix.getAccount3pid();
  let email;

  if (
    objType(pidData, 'object') &&
    Array.isArray(pidData.threepids) &&
    pidData.threepids.length > 0
  ) {
    for (const item in pidData.threepids) {
      if (pidData.threepids[item].medium === 'email') {
        email = pidData.threepids[item].address;
        break;
      }
    }
  }

  // Space Container
  const spaceContainer = $('.space-container');

  // Superagent
  let superagent = spaceContainer.find('#agi-superagent');
  if (superagent.length > 0) {
    superagent.remove();
  }

  // Prepare Button
  superagent = createButton('superagent', 'SuperAgent', 'fa-solid fa-user-ninja');

  // Add Click
  setLoadingPage(false);
  superagent.tooltip({ placement: 'right' }).on('click', () =>
    btModal({
      id: 'agi-superagent-modal',
      dialog: 'modal-fullscreen',
      title: 'SuperAgent',
      body: jReact(
        <iframe
          title="SuperAgent"
          src={`https://super.${serverDomain}/?email=${encodeURIComponent(email)}`}
          className="w-100 height-modal-full-size"
          style={{ backgroundColor: '#000' }}
        />,
      ),
    }),
  );

  // Append
  spaceContainer.append(superagent);
}
