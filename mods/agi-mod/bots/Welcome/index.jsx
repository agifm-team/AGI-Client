/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { objType } from 'for-promise/utils/lib.mjs';
import Iframe /* { postMessage } */ from '@src/app/molecules/iframe/Iframe';

import './custom.scss';
import './logo.scss';
import { joinAiBot, joinAiRoom, joinAiSpace } from './execute';

function Welcome({ isGuest }) {
  // Result
  return (
    <Iframe
      style={{ height: '100%' }}
      src="https://pixx.framer.website/"
      alt="framer"
      onMessage={(event, data) => {
        if (objType(data, 'object')) {
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
  );
}

export default Welcome;
