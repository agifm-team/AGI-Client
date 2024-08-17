import React, { useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { UserEvent } from 'matrix-js-sdk';
import { objType } from 'for-promise/utils/lib.mjs';

import Img from '@src/app/atoms/image/Image';
import envAPI from '@src/util/libs/env';
import { openProfileViewer } from '@src/client/action/navigation';
import { convertUserId } from '@src/util/matrixUtil';

import Clock from '@src/app/atoms/time/Clock';
import { getUserWeb3Account, getWeb3Cfg } from '../../../util/web3';

import { twemojifyReact } from '../../../util/twemojify';

import Avatar, { AvatarJquery } from '../../atoms/avatar/Avatar';
import { getUserStatus, updateUserStatusIcon, canUsePresence } from '../../../util/onlineStatus';
import initMatrix from '../../../client/initMatrix';
import { cssColorMXID } from '../../../util/colorMXID';
import { addToDataFolder, getDataList } from '../../../util/selectedRoom';
import matrixAppearance from '../../../util/libs/appearance';

function PeopleSelectorBanner({ name, color, user = null, roomId }) {
  const [, forceUpdate] = useReducer((count) => count + 1, 0);

  const statusRef = useRef(null);

  const userNameRef = useRef(null);
  const displayNameRef = useRef(null);
  const profileAvatar = useRef(null);

  const noteRef = useRef(null);

  const [avatarUrl, setUserAvatar] = useState(user ? user?.avatarUrl : null);
  const [accountContent, setAccountContent] = useState(null);
  const [bannerSrc, setBannerSrc] = useState(null);
  const [loadingBanner, setLoadingBanner] = useState(false);

  const mx = initMatrix.matrixClient;
  const mxcUrl = initMatrix.mxcUrl;

  useEffect(() => {
    if (user) {
      // Read Events
      const tinyNote = getDataList('user_cache', 'note', user.userId);

      const tinyNoteSpacing = (event) => {
        const element = event.target;
        element.style.height = '5px';
        element.style.height = `${Number(element.scrollHeight)}px`;
      };

      // Update Note
      const tinyNoteUpdate = (event) => {
        addToDataFolder('user_cache', 'note', user.userId, $(event.target).val(), 200);
      };

      // Open user profile
      const profileViewer = () => {
        openProfileViewer(user.userId, roomId);
      };

      // Read Events
      $(displayNameRef.current).find('> .button').on('click', profileViewer);
      $(userNameRef.current).find('> .button').on('click', profileViewer);
      $(noteRef.current)
        .on('change', tinyNoteUpdate)
        .on('keypress keyup keydown', tinyNoteSpacing)
        .val(tinyNote);
      return () => {
        $(displayNameRef.current).find('> .button').off('click', profileViewer);
        $(userNameRef.current).find('> .button').off('click', profileViewer);
        $(noteRef.current)
          .off('change', tinyNoteUpdate)
          .off('keypress keyup keydown', tinyNoteSpacing);
      };
    }
  }, [user]);

  useEffect(() => {
    const updateClock = () => forceUpdate();
    matrixAppearance.on('simplerHashtagSameHomeServer', updateClock);
    return () => {
      matrixAppearance.off('simplerHashtagSameHomeServer', updateClock);
    };
  });

  // User profile updated
  useEffect(() => {
    if (user) {
      const updateProfileStatus = (mEvent, tinyData) => {
        // Tiny Data
        const tinyUser = tinyData;

        // Get Status
        const status = $(statusRef.current);

        // Is You
        if (tinyUser.userId === mx.getUserId()) {
          const yourData = clone(mx.getAccountData('pony.house.profile')?.getContent() ?? {});
          yourData.ethereum = getUserWeb3Account();
          if (typeof yourData.ethereum.valid !== 'undefined') delete yourData.ethereum.valid;
          tinyUser.presenceStatusMsg = JSON.stringify(yourData);
        }

        console.log(tinyUser);
        // Update Status Icon
        setAccountContent(updateUserStatusIcon(status, tinyUser));
        setUserAvatar(tinyUser?.avatarUrl);
      };

      user.on(UserEvent.CurrentlyActive, updateProfileStatus);
      user.on(UserEvent.LastPresenceTs, updateProfileStatus);
      user.on(UserEvent.Presence, updateProfileStatus);
      if (user) user.on(UserEvent.AvatarUrl, updateProfileStatus);
      updateProfileStatus(null, user);

      return () => {
        if (user) user.removeListener(UserEvent.CurrentlyActive, updateProfileStatus);
        if (user) user.removeListener(UserEvent.LastPresenceTs, updateProfileStatus);
        if (user) user.removeListener(UserEvent.Presence, updateProfileStatus);
        if (user) user.on(UserEvent.AvatarUrl, updateProfileStatus);
      };
    }
  }, [user]);

  // Exist Presence
  const existPresenceObject = accountContent && objType(accountContent.presenceStatusMsg, 'object');

  // Ethereum Config
  const ethConfig = getWeb3Cfg();
  const existEthereum =
    envAPI.get('WEB3') &&
    ethConfig.web3Enabled &&
    existPresenceObject &&
    accountContent.presenceStatusMsg.ethereum &&
    accountContent.presenceStatusMsg.ethereum.valid;

  // Exist message presence
  const existMsgPresence =
    existPresenceObject &&
    typeof accountContent.presenceStatusMsg.msg === 'string' &&
    accountContent.presenceStatusMsg.msg.length > 0;

  // Exist Icon Presence
  const existIconPresence =
    existPresenceObject &&
    typeof accountContent.presenceStatusMsg.msgIcon === 'string' &&
    accountContent.presenceStatusMsg.msgIcon.length > 0;

  // Exist banner
  const existBanner =
    existPresenceObject &&
    typeof accountContent.presenceStatusMsg.bannerThumb === 'string' &&
    accountContent.presenceStatusMsg.bannerThumb.length > 0 &&
    typeof accountContent.presenceStatusMsg.banner === 'string' &&
    accountContent.presenceStatusMsg.banner.length > 0;

  if (existPresenceObject && existBanner && !bannerSrc && !loadingBanner) {
    setLoadingBanner(true);
    const bannerData = AvatarJquery({
      isObj: true,
      imageSrc: accountContent.presenceStatusMsg.bannerThumb,
      imageAnimSrc: accountContent.presenceStatusMsg.banner,
      onLoadingChange: () => {
        if (typeof bannerData.blobAnimSrc === 'string' && bannerData.blobAnimSrc.length > 0) {
          setBannerSrc(bannerData.blobAnimSrc);
          setLoadingBanner(false);
        }
      },
    });
  }

  if (user) {
    return (
      <>
        <div
          className={`profile-banner profile-bg${cssColorMXID(user ? user.userId : null)}${existBanner ? ' exist-banner' : ''}`}
          style={{ backgroundImage: bannerSrc ? `url("${bannerSrc}")` : null }}
        />

        <div className="text-center profile-user-profile-avatar">
          <Avatar
            animParentsCount={2}
            imgClass="profile-image-container"
            className="profile-image-container"
            ref={profileAvatar}
            imageSrc={mxcUrl.toHttp(avatarUrl, 100, 100)}
            imageAnimSrc={mxcUrl.toHttp(avatarUrl)}
            text={name}
            bgColor={color}
            size="large"
            isDefaultImage
          />
          {canUsePresence() && (
            <i
              ref={statusRef}
              className={`user-status user-status-icon pe-2 ${getUserStatus(user)}`}
            />
          )}
        </div>

        <div className="card bg-bg mx-3 text-start">
          <div className="card-body">
            <h6 ref={displayNameRef} className="emoji-size-fix m-0 mb-1 fw-bold display-name">
              <span className="button">{twemojifyReact(name)}</span>
            </h6>
            <small ref={userNameRef} className="text-gray emoji-size-fix username">
              <span className="button">{twemojifyReact(convertUserId(user.userId))}</span>
            </small>

            {existPresenceObject ? (
              <>
                {typeof accountContent.presenceStatusMsg.pronouns === 'string' &&
                accountContent.presenceStatusMsg.pronouns.length > 0 ? (
                  <div className="text-gray emoji-size-fix pronouns small">
                    {twemojifyReact(accountContent.presenceStatusMsg.pronouns.substring(0, 20))}
                  </div>
                ) : null}

                {existMsgPresence || existIconPresence ? (
                  <div
                    className={`mt-2${existMsgPresence ? ' emoji-size-fix ' : ''}small user-custom-status${!existMsgPresence ? ' custom-status-emoji-only' : ''}`}
                  >
                    {existIconPresence ? (
                      <Img
                        className="emoji me-1"
                        alt="icon"
                        src={accountContent.presenceStatusMsg.msgIcon}
                      />
                    ) : null}
                    {existMsgPresence ? (
                      <span className="text-truncate cs-text">
                        {twemojifyReact(accountContent.presenceStatusMsg.msg.substring(0, 100))}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : null}

            {accountContent ? (
              // Object presence status
              existPresenceObject ? (
                <>
                  {typeof accountContent.presenceStatusMsg.timezone === 'string' &&
                  accountContent.presenceStatusMsg.timezone.length > 0 ? (
                    <>
                      <hr />

                      <div className="text-gray text-uppercase fw-bold very-small mb-2">
                        Timezone
                      </div>
                      <div className="emoji-size-fix small text-freedom">
                        <Clock
                          timezone={accountContent.presenceStatusMsg.timezone}
                          calendarFormat="MMMM Do YYYY, {time}"
                        />
                      </div>
                    </>
                  ) : null}

                  {typeof accountContent.presenceStatusMsg.bio === 'string' &&
                  accountContent.presenceStatusMsg.bio.length > 0 ? (
                    <>
                      <hr />
                      <div className="text-gray text-uppercase fw-bold very-small mb-2">
                        About me
                      </div>
                      <div className="emoji-size-fix small text-freedom">
                        {twemojifyReact(
                          accountContent.presenceStatusMsg.bio.substring(0, 190),
                          undefined,
                          true,
                          false,
                        )}
                      </div>
                    </>
                  ) : null}
                </>
              ) : // Text presence status
              typeof accountContent.presenceStatusMsg === 'string' &&
                accountContent.presenceStatusMsg.length > 0 ? (
                <div className="mt-2 emoji-size-fix small user-custom-status">
                  <span className="text-truncate cs-text">
                    {twemojifyReact(accountContent.presenceStatusMsg.substring(0, 100))}
                  </span>
                </div>
              ) : null
            ) : null}

            <hr />

            <label
              htmlFor="tiny-note"
              className="form-label text-gray text-uppercase fw-bold very-small mb-2"
            >
              Note
            </label>
            <textarea
              ref={noteRef}
              spellCheck="false"
              className="form-control form-control-bg emoji-size-fix small"
              id="tiny-note"
              placeholder="Insert a note here"
            />
          </div>
        </div>
      </>
    );
  }

  return null;
}

PeopleSelectorBanner.propTypes = {
  user: PropTypes.object,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default PeopleSelectorBanner;
