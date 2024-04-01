import React from 'react';
import * as linkify from 'linkifyjs';

import { btModal, objType } from '@src/util/tools';

import initMatrix from '@src/client/initMatrix';
import RawIcon from '@src/app/atoms/system-icons/RawIcon';
import tinyAPI from '@src/util/mods';
import * as roomActions from '@src/client/action/room';

import { setLoadingPage } from '@src/app/templates/client/Loading';
// import { selectRoom, selectRoomMode, selectTab } from '@src/client/action/navigation';

// import { join } from '@src/client/action/room';

import jReact from '../../lib/jReact';
import { serverDomain } from '../socket';
import { updateAgentsList } from '../bots/PeopleSelector';

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

let waitingUrl;
let iframe;
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

  // Timeline validator to get the magic lick
  const roomTimelineValidator = (data, event) => {
    // Get content
    const content = event.getContent();
    if (
      event.sender.userId === `@otp:${serverDomain}` &&
      typeof content.magic_link === 'string' &&
      linkify.test(content.magic_link)
    ) {
      // Exist iframe? Insert the magic link into this
      if (!iframe) waitingUrl = content.magic_link;
      else iframe.attr('src', content.magic_link);

      // Complete. Close the room now
      roomActions.leave(event.roomId);
    }
  };

  tinyAPI.on('roomTimeline', roomTimelineValidator);

  // Add Click
  setLoadingPage(false);
  superagent.tooltip({ placement: 'right' }).on('click', () => {
    const newUrl = !waitingUrl
      ? `https://super.${serverDomain}/?email=${encodeURIComponent(email)}`
      : waitingUrl;
    iframe = $('<iframe>', {
      title: 'SuperAgent',
      src: newUrl,
      class: 'w-100 height-modal-full-size',
    }).css('background-color', '#000');
    waitingUrl = null;

    btModal({
      id: 'agi-superagent-modal',
      dialog: 'modal-fullscreen',
      title: 'SuperAgent',
      hidden: () => {
        iframe = null;
        setLoadingPage();
        updateAgentsList()
          .then(() => {
            setLoadingPage(false);
          })
          .catch((err) => {
            console.error(err);
            setLoadingPage(false);
          });
      },
      body: iframe,
    });
  });

  // Append
  spaceContainer.append(superagent);
}
