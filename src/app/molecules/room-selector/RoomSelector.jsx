import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { twemojifyReact } from '../../../util/twemojify';
import { colorMXID } from '../../../util/colorMXID';

import Text from '../../atoms/text/Text';
import Avatar from '../../atoms/avatar/Avatar';
import NotificationBadge from '../../atoms/badge/NotificationBadge';
import { blurOnBubbling } from '../../atoms/button/script';
import { getPresence, getUserStatus, updateUserStatusIcon } from '../../../util/onlineStatus';
import initMatrix from '../../../client/initMatrix';
import insertCustomStatus from '../people-selector/insertCustomStatus';

function RoomSelectorWrapper({
  isSelected, isMuted, isUnread, onClick,
  content, options, onContextMenu,
}) {
  const classes = ['room-selector'];
  if (isMuted) classes.push('room-selector--muted');
  if (isUnread) classes.push('room-selector--unread');
  if (isSelected) classes.push('room-selector--selected');

  return (
    <div className={classes.join(' ')}>
      <button
        className="room-selector__content emoji-size-fix"
        type="button"
        onClick={onClick}
        onMouseUp={(e) => blurOnBubbling(e, '.room-selector__content')}
        onContextMenu={onContextMenu}
      >
        {content}
      </button>
      <div className="room-selector__options">{options}</div>
    </div>
  );
}
RoomSelectorWrapper.defaultProps = {
  isMuted: false,
  options: null,
  onContextMenu: null,
};
RoomSelectorWrapper.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  isMuted: PropTypes.bool,
  isUnread: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  content: PropTypes.node.isRequired,
  options: PropTypes.node,
  onContextMenu: PropTypes.func,
};

function RoomSelector({
  name, parentName, roomId, room, imageSrc, imageAnimSrc, animParentsCount, iconSrc,
  isSelected, isMuted, isUnread, notificationCount, isAlert,
  options, onClick, onContextMenu, isProfile, notSpace, user,
}) {

  const [userData, setPresenceStatus] = useState(null);
  const [imgAnimSrc, setImgAnimSrc] = useState(imageAnimSrc);
  const [imgSrc, setImgSrc] = useState(imageSrc);
  const [roomName, setName] = useState(name);

  const statusRef = useRef(null);
  const customStatusRef = useRef(null);

  const mx = initMatrix.matrixClient;

  if (user && !userData) {
    setPresenceStatus(getPresence(user));
  }

  useEffect(() => {
    if (user) {

      // Status
      const status = $(statusRef.current);

      // Update Status Profile
      const updateProfileStatus = (mEvent, tinyUser) => {

        // Presence
        const content = updateUserStatusIcon(status, tinyUser);

        // Image
        let newImageSrc = tinyUser && tinyUser.avatarUrl ? mx.mxcUrlToHttp(tinyUser.avatarUrl, 24, 24, 'crop') : (room && room.getAvatarFallbackMember()?.getAvatarUrl(mx.baseUrl, 24, 24, 'crop')) || null;
        if (room && newImageSrc === null) newImageSrc = room.getAvatarUrl(mx.baseUrl, 24, 24, 'crop') || null;
        setImgSrc(newImageSrc);

        let newImageAnimSrc = tinyUser && tinyUser.avatarUrl ? mx.mxcUrlToHttp(tinyUser.avatarUrl) : (room && room.getAvatarFallbackMember()?.getAvatarUrl(mx.baseUrl)) || null;
        if (room && newImageAnimSrc === null) newImageAnimSrc = room.getAvatarUrl(mx.baseUrl) || null;
        setImgAnimSrc(newImageAnimSrc);

        // Room Name
        let newRoomName = room.name;

        if (typeof tinyUser.displayName === 'string' && tinyUser.displayName.length > 0) {
          newRoomName = tinyUser.displayName;
        }

        else if (typeof tinyUser.userId === 'string' && tinyUser.userId.length > 0) {
          newRoomName = tinyUser.userId;
        }

        setName(newRoomName);
        insertCustomStatus(customStatusRef, content);

        setPresenceStatus(content);

      };

      user.on('User.avatarUrl', updateProfileStatus);
      user.on('User.currentlyActive', updateProfileStatus);
      user.on('User.lastPresenceTs', updateProfileStatus);
      user.on('User.presence', updateProfileStatus);

      return () => {
        user.removeListener('User.currentlyActive', updateProfileStatus);
        user.removeListener('User.lastPresenceTs', updateProfileStatus);
        user.removeListener('User.presence', updateProfileStatus);
        user.removeListener('User.avatarUrl', updateProfileStatus);
      };

    }
  });

  return <RoomSelectorWrapper
    isSelected={isSelected}
    isMuted={isMuted}
    isUnread={isUnread}
    content={(
      <>

        <Avatar
          text={roomName}
          bgColor={colorMXID(roomId)}
          imageSrc={imgSrc}
          animParentsCount={animParentsCount}
          imageAnimSrc={imgAnimSrc}
          iconColor="var(--ic-surface-low)"
          iconSrc={!isProfile ? iconSrc : null}
          faSrc={isProfile ? 'bi bi-person-badge-fill profile-icon-fa' : null}
          size="extra-small"
          isDefaultImage={(!iconSrc || notSpace)}
        />

        {user ? <i ref={statusRef} className={`user-status pe-2 ${getUserStatus(user)}`} /> : null}

        <Text variant="b1" weight={isUnread ? 'medium' : 'normal'}>
          {twemojifyReact(roomName)}
          {parentName && (
            <span className="very-small text-gray">
              {' — '}
              {twemojifyReact(parentName)}
            </span>
          )}
        </Text>

        {isUnread && (
          <NotificationBadge
            alert={isAlert}
            content={notificationCount !== 0 ? notificationCount : null}
          />
        )}

        {user ? <div ref={customStatusRef} className='d-none very-small text-gray text-truncate emoji-size-fix-2 user-custom-status' /> : null}

      </>
    )}
    options={options}
    onClick={onClick}
    onContextMenu={onContextMenu}
  />;

}

RoomSelector.defaultProps = {
  animParentsCount: 4,
  notSpace: false,
  isProfile: false,
  parentName: null,
  isSelected: false,
  imageSrc: null,
  imageAnimSrc: null,
  iconSrc: null,
  isMuted: false,
  options: null,
  onContextMenu: null,
};
RoomSelector.propTypes = {
  animParentsCount: PropTypes.number,
  notSpace: PropTypes.bool,
  isProfile: PropTypes.bool,
  name: PropTypes.string.isRequired,
  parentName: PropTypes.string,
  roomId: PropTypes.string.isRequired,
  imageSrc: PropTypes.string,
  imageAnimSrc: PropTypes.string,
  iconSrc: PropTypes.string,
  isSelected: PropTypes.bool,
  isMuted: PropTypes.bool,
  isUnread: PropTypes.bool.isRequired,
  notificationCount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  isAlert: PropTypes.bool.isRequired,
  options: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func,
};

export default RoomSelector;
