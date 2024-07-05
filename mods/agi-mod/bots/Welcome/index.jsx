/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { objType } from 'for-promise/utils/lib.mjs';
import Iframe /* { postMessage } */ from '@src/app/molecules/iframe/Iframe';
import { selectRoomMode } from '@src/client/action/navigation';

import './custom.scss';
import { joinAiBot, joinAiRoom, joinAiSpace } from './execute';

function Welcome({ isGuest }) {
  const framerRef = useRef(null);

  useEffect(() => {});

  // Result
  return (
    <div className={`tiny-welcome border-0 h-100 noselect${isGuest ? ' is-guest' : ''}`}>
      <Iframe
        ref={framerRef}
        id="pixx-framer"
        style={{ height: '100%' }}
        src={`https://pixx.framer.website/${isGuest ? '?is_guest=true' : ''}`}
        alt="framer"
        onMessage={(event, data) => {
          if (objType(data, 'object') && !isGuest) {
            if (data.type === 'open_dm') {
              joinAiBot(data.value);
            } else if (data.type === 'open_room') {
              joinAiRoom(data.value);
            } else if (data.type === 'open_space') {
              joinAiSpace(data.value);
            }
          }
        }}
      />
      {!isGuest ? (
        <center id="menu" className={`py-4 px-4 w-100 mb-5 d-md-none`}>
          <div className={`text-start w-100`}>
            <button
              type="button"
              className="me-3 btn btn-primary"
              id="leave-welcome"
              onClick={() => selectRoomMode('navigation')}
            >
              <i className="fa-solid fa-left-long" />
            </button>
          </div>
        </center>
      ) : null}
    </div>
  );
}

export default Welcome;
