import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// import { selectRoom, selectRoomMode, selectTab } from '@src/client/action/navigation';
// import cons from '@src/client/state/cons';

import * as roomActions from '@src/client/action/room';

/* import {
    hasDMWith, hasDevices,
} from '@src/util/matrixUtil'; */

import { setLoadingPage } from '@src/app/templates/client/Loading';
import { getRoomInfo } from '@src/app/organisms/room/Room';
import { openProfileViewer } from '@src/client/action/navigation';
import { twemojifyReact } from '@src/util/twemojify';

function PeopleSelector({ avatarSrc, name, user, peopleRole /* , customData */ }) {
  // Refs
  const buttonRef = useRef(null);
  const profileButtonRef = useRef(null);
  const userId = user?.userId || name;

  // Effect
  useEffect(() => {
    // Get Button
    const button = $(buttonRef.current);
    const profileButton = $(profileButtonRef.current);
    const tinyButton = async () => {
      if (typeof userId === 'string') {
        const roomId = getRoomInfo().roomTimeline.room.roomId;

        setLoadingPage();
        roomActions
          .invite(roomId, userId.startsWith('@') ? userId : `@${userId}`)
          .then(() => setLoadingPage(false))
          .catch((err) => {
            setLoadingPage(false);
            console.error(err);
            alert(err.message);
          });
      }
    };

    const tinyProfileAction = () => {
      openProfileViewer(userId, getRoomInfo().roomTimeline.roomId);
    };

    // Insert Event Click
    button.on('click', tinyButton);
    const profileAvatar = profileButton.find('.avatar-place');
    const botNameButton = profileButton.find('.bot-name');
    const botRoleButton = profileButton.find('.bot-role');
    profileAvatar.on('click', tinyProfileAction);
    botNameButton.on('click', tinyProfileAction);
    botRoleButton.on('click', tinyProfileAction);
    return () => {
      button.off('click', tinyButton);
      profileAvatar.off('click', tinyProfileAction);
      botNameButton.off('click', tinyProfileAction);
      botRoleButton.off('click', tinyProfileAction);
    };
  });

  let newName = typeof name === 'string' ? name.split(':')[0] : '';
  if (newName.startsWith('@')) newName = newName.substring(1);
  return peopleRole !== 'divisor' ? (
    <div ref={profileButtonRef} className="card agent-button noselect">
      <div className="avatar-place text-start my-3 mx-4">
        <img
          src={avatarSrc}
          className="img-fluid avatar rounded-circle"
          draggable={false}
          height={100}
          width={100}
          alt="avatar"
        />
      </div>
      <div className="button-place text-start card-body mt-0 pt-0">
        <h5 className="card-title small text-bg">
          <span className="bot-name">{twemojifyReact(newName)}</span>
          <div className="float-end">
            <button ref={buttonRef} className="btn btn-primary btn-sm my-1">
              Invite
            </button>
          </div>
        </h5>
        <p className="bot-role card-text very-small text-bg-low">{peopleRole}</p>
      </div>
    </div>
  ) : (
    <h5>{name}</h5>
  );
}

PeopleSelector.defaultProps = {
  avatarSrc: null,
  peopleRole: null,
};

PeopleSelector.propTypes = {
  avatarSrc: PropTypes.string,
  name: PropTypes.string.isRequired,
  peopleRole: PropTypes.string,
};

export default PeopleSelector;
