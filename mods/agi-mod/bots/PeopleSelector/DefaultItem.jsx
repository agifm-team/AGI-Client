import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { twemojifyReact } from '@src/util/twemojify';

import Avatar, { avatarDefaultColor } from '@src/app/atoms/avatar/Avatar';
import { getPresence } from '@src/util/onlineStatus';
import initMatrix from '@src/client/initMatrix';
import { getAnimatedImageUrl, getAppearance } from '@src/util/libs/appearance';
import { colorMXID } from '@src/util/colorMXID';
import { setLoadingPage } from '@src/app/templates/client/Loading';
import Img from '@src/app/atoms/image/Image';
import UserStatusIcon from '@src/app/atoms/user-status/UserStatusIcon';

function PeopleSelector({
  avatarSrc = null,
  avatarAnimSrc = null,
  name,
  color,
  peopleRole = null,
  onClick,
  user = null,
  disableStatus = false,
  avatarSize = 32,
  contextMenu,
  agents,
}) {
  const statusRef = useRef(null);
  const customStatusRef = useRef(null);

  const [accountContent, setAccountContent] = useState(null);
  const [imageAnimSrc, setImageAnimSrc] = useState(avatarAnimSrc);
  const [imageSrc, setImageSrc] = useState(avatarSrc);

  useEffect(() => {
    if (user) {
      const mx = initMatrix.matrixClient;

      // Update Status Profile
      const updateProfileStatus = (mEvent, tinyData) => {
        // Get Status
        const appearanceSettings = getAppearance();

        // Image
        const newImageSrc =
          tinyData && tinyData.avatarUrl
            ? mx.mxcUrlToHttp(tinyData.avatarUrl, 100, 100, 'crop')
            : null;
        setImageSrc(newImageSrc);

        const newImageAnimSrc =
          tinyData && tinyData.avatarUrl
            ? !appearanceSettings.enableAnimParams
              ? mx.mxcUrlToHttp(tinyData.avatarUrl)
              : getAnimatedImageUrl(mx.mxcUrlToHttp(tinyData.avatarUrl, 100, 100, 'crop'))
            : null;
        setImageAnimSrc(newImageAnimSrc);

        // Update Status Icon
        setAccountContent(getPresence(tinyData));
      };

      // Read Events
      user.on('User.avatarUrl', updateProfileStatus);
      user.on('User.currentlyActive', updateProfileStatus);
      user.on('User.lastPresenceTs', updateProfileStatus);
      user.on('User.presence', updateProfileStatus);
      if (!accountContent) updateProfileStatus(null, user);
      return () => {
        user.removeListener('User.currentlyActive', updateProfileStatus);
        user.removeListener('User.lastPresenceTs', updateProfileStatus);
        user.removeListener('User.presence', updateProfileStatus);
        user.removeListener('User.avatarUrl', updateProfileStatus);
      };
    }
  }, [user]);

  /*
          <Avatar
          imageAnimSrc={imageAnimSrc}
          imageSrc={imageSrc}
          text={name}
          bgColor={color}
          size="small"
          isDefaultImage
        />
  */

  const tinyColor = colorMXID(user ? user.userId : 0);
  const defaultAvatar = avatarDefaultColor(tinyColor);
  const isAgent = user && agents.indexOf(user.userId) > -1;
  let newName = typeof name === 'string' ? name.split(':')[0] : '';
  if (newName.startsWith('@')) newName = newName.substring(1);

  return (
    <div className="card agent-button noselect" onClick={onClick} onContextMenu={contextMenu}>
      <div className="avatar-place text-start my-3 mx-4">
        <Img
          bgColor={tinyColor}
          defaultAvatar
          getDefaultImage={avatarDefaultColor}
          src={avatarSrc || defaultAvatar}
          className="img-fluid avatar rounded-circle"
          height={100}
          width={100}
          alt="avatar"
        />
        {!disableStatus ? (
          <UserStatusIcon classBase="" user={user} presenceData={accountContent} />
        ) : (
          ''
        )}
      </div>
      <div className="button-place text-start card-body mt-0 pt-0">
        <h5 className="card-title small text-bg">
          <span className="bot-name">{twemojifyReact(newName)}</span>
          <div className="float-end">
            {user && isAgent ? (
              <button
                onClick={async () => {
                  setLoadingPage();
                  reconnectAgent(user.userId)
                    .then(() => {
                      setLoadingPage(false);
                    })
                    .catch((err) => {
                      console.error(err);
                      alert(err.message);
                    });
                }}
                className="btn btn-primary btn-sm my-1"
              >
                Restart
              </button>
            ) : null}
          </div>
        </h5>
        <p className="bot-role card-text very-small text-bg-low">{peopleRole}</p>
      </div>
    </div>
  );
}

PeopleSelector.propTypes = {
  avatarSize: PropTypes.number,
  disableStatus: PropTypes.bool,
  user: PropTypes.object,
  avatarAnimSrc: PropTypes.string,
  avatarSrc: PropTypes.string,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  peopleRole: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default PeopleSelector;
