import React from 'react';
import PropTypes from 'prop-types';

import { objType } from 'for-promise/utils/lib.mjs';
import { twemojifyReact } from '@src/util/twemojify';
import Img from '@src/app/atoms/image/Image';

const UserCustomStatus = React.forwardRef(
  ({ presenceData = null, className = null, forceShow = false }, ref) => {
    const existPresenceObject = presenceData && objType(presenceData.presenceStatusMsg, 'object');
    const presenceIsPureText =
      presenceData &&
      typeof presenceData.presenceStatusMsg === 'string' &&
      presenceData.presenceStatusMsg.length > 0;

    const existMsgPresence =
      existPresenceObject &&
      typeof presenceData.presenceStatusMsg.msg === 'string' &&
      presenceData.presenceStatusMsg.msg.length > 0;

    const existIconPresence =
      existPresenceObject &&
      typeof presenceData.presenceStatusMsg.msgIcon === 'string' &&
      presenceData.presenceStatusMsg.msgIcon.length > 0;

    const canShowPresence =
      forceShow ||
      ((existPresenceObject || presenceIsPureText) &&
        presenceData.presence !== 'offline' &&
        presenceData.presence !== 'invisible');

    if (canShowPresence && (existIconPresence || existMsgPresence || presenceIsPureText))
      return (
        <div
          ref={ref}
          className={`${existMsgPresence ? 'emoji-size-fix ' : ''}user-custom-status${!existMsgPresence ? ' custom-status-emoji-only' : ''}${className ? ` ${className}` : ''}`}
        >
          {existIconPresence ? (
            <Img className="emoji me-1" alt="icon" src={presenceData.presenceStatusMsg.msgIcon} />
          ) : null}
          {existMsgPresence ? (
            <span className="text-truncate cs-text">
              {twemojifyReact(
                !presenceIsPureText
                  ? presenceData.presenceStatusMsg.msg.substring(0, 100)
                  : presenceData.presenceStatusMsg.substring(0, 100),
              )}
            </span>
          ) : null}
        </div>
      );

    return null;
  },
);

UserCustomStatus.propTypes = {
  className: PropTypes.string,
  presenceData: PropTypes.object,
};

export default UserCustomStatus;
