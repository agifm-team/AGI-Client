import React, { useState } from 'react';
import Button from '@src/app/atoms/button/Button';
import PeopleDrawerBase from '@src/app/organisms/room/PeopleDrawerBase';
import initMatrix from '@src/client/initMatrix';
import Iframe from '@src/app/atoms/iframe/Iframe';

export default function LeftEmbed({ sideIframe = {}, roomId }) {
  const [expandPixxIframe, setExpandPixxIframe] = useState(false);
  const room = initMatrix.matrixClient.getRoom(roomId);

  if (expandPixxIframe) $('body').addClass('spaceship-iframe-expand-enabled');
  else $('body').removeClass('spaceship-iframe-expand-enabled');

  if (sideIframe.enabled && sideIframe.url) $('body').addClass('spaceship-iframe-enabled');
  else $('body').removeClass('spaceship-iframe-enabled');

  return (
    <PeopleDrawerBase
      className={`spaceship-embed-drawer${expandPixxIframe ? ' w-100' : ''}`}
      contentLeft={
        <li className="nav-item ps-2">
          Embed
          <div className="very-small text-gray">
            {!expandPixxIframe ? 'Message Data' : `${room.name} message data`}
          </div>
        </li>
      }
    >
      <div className={`spaceship-embed-expand${expandPixxIframe ? ' clicked' : ''}`}>
        <Button
          variant="primary"
          type="button"
          faSrc="fa-solid fa-expand"
          onClick={() => setExpandPixxIframe(!expandPixxIframe)}
        />
      </div>
      <Iframe
        className={`h-100 spaceship-embed${!expandPixxIframe ? '' : ' w-100'}`}
        alt="spaceship embed"
        src={sideIframe.url}
      />
    </PeopleDrawerBase>
  );
}
