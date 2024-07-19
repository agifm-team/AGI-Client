import React, { useState } from 'react';
import Button from '@src/app/atoms/button/Button';
import PeopleDrawerBase from '@src/app/organisms/room/PeopleDrawerBase';

export default function LeftEmbed({ sideIframe = {} }) {
  const [expandPixxIframe, setExpandPixxIframe] = useState(false);

  if (expandPixxIframe) $('body').addClass('roomviewer-top-iframe-expand-enabled');
  else $('body').removeClass('roomviewer-top-iframe-expand-enabled');

  return (
    <PeopleDrawerBase
      contentLeft={
        <li className="nav-item ps-2">
          Embed
          <div className="very-small text-gray">Message Data</div>
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
      <iframe
        className={`h-100 spaceship-embed${!expandPixxIframe ? '' : ' expand-embed'}`}
        alt="spaceship embed"
        src={sideIframe.url}
      />
    </PeopleDrawerBase>
  );
}
