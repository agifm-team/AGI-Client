import React, { useState } from 'react';

export default function LeftEmbed({ sideIframe = {} }) {
  const [expandPixxIframe, setExpandPixxIframe] = useState(false);

  if (expandPixxIframe) $('body').addClass('roomviewer-top-iframe-expand-enabled');
  else $('body').removeClass('roomviewer-top-iframe-expand-enabled');

  return sideIframe.enabled ? (
    <>
      <div className={`chatbox-top-embed-expand${expandPixxIframe ? ' clicked' : ''}`}>
        <Button
          variant="primary"
          type="button"
          faSrc="fa-solid fa-expand"
          onClick={() => setExpandPixxIframe(!expandPixxIframe)}
        />
      </div>
      <iframe
        className={`chatbox-top-embed${!expandPixxIframe ? '' : ' expand-embed'}`}
        alt="spaceship embed"
        src={sideIframe.url}
      />
    </>
  ) : null;
}
