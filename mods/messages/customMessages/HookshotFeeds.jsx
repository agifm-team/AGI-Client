import React, { useRef, useEffect, useState } from 'react';
import getUrlPreview from '@src/util/libs/getUrlPreview';
import { twemojifyReact } from '@src/util/twemojify';
import initMatrix from '@src/client/initMatrix';

import openTinyURL from '@src/util/message/urlProtection';

import * as Media from '@src/app/molecules/media/Media';
import { mediaFix } from '@src/app/molecules/media/mediaFix';

function HookshotFeeds({ feedData, roomId, threadId }) {
  const embedRef = useRef(null);
  const embedButton = useRef(null);
  const [embed, setEmbed] = useState(null);
  const [embedHeight, setEmbedHeight] = useState(null);

  // Matrix
  const mx = initMatrix.matrixClient;
  const mxcUrl = initMatrix.mxcUrl;

  useEffect(() => {
    if (!embed && typeof feedData.link === 'string' && feedData.link.length > 0)
      getUrlPreview(feedData.link)
        .then((json) => setEmbed(json))
        .catch(console.error);

    const button = $(embedButton.current);
    const openUrl = (event) => {
      const e = event.originalEvent;
      e.preventDefault();
      openTinyURL($(e.target).attr('href'), $(e.target).attr('href'));
      return false;
    };

    setTimeout(() => mediaFix(embedRef, embedHeight, setEmbedHeight), 500);

    button.on('click', openUrl);
    return () => {
      button.off('click', openUrl);
    };
  });

  useEffect(() => mediaFix(embedRef, embedHeight, setEmbedHeight));
  return (
    <div ref={embedRef} className="card hookshot-feeds">
      {embed && typeof embed['og:image'] === 'string' && embed['og:image'].length > 0 ? (
        <Media.Image
          roomId={roomId}
          threadId={threadId}
          name="banner"
          className="card-img-top"
          width={Number(embed['og:image:width'])}
          height={Number(embed['og:image:height'])}
          link={mxcUrl.toHttp(embed['og:image'], 2000, 2000)}
          type={String(embed['og:image:type'])}
          maxWidth={548}
          ignoreContainer
        />
      ) : null}

      <div className="card-body">
        {typeof feedData.title === 'string' && feedData.title.length > 0 ? (
          <h6 className="card-title emoji-size-fix">{twemojifyReact(feedData.title)}</h6>
        ) : null}

        {embed &&
        typeof embed['og:description'] === 'string' &&
        embed['og:description'].length > 0 ? (
          <p className="card-text small text-freedom text-bg-low emoji-size-fix-2">
            {twemojifyReact(embed['og:description'], undefined, true, false, true)}
          </p>
        ) : typeof feedData.summary === 'string' && feedData.summary.length > 0 ? (
          <p className="card-text small text-freedom text-bg-low emoji-size-fix-2">
            {twemojifyReact(feedData.summary, undefined, true, false, true)}
          </p>
        ) : null}

        {typeof feedData.link === 'string' && feedData.link.length > 0 ? (
          <a
            ref={embedButton}
            href={feedData.link}
            target="_blank"
            className="btn btn-primary btn-sm text-bg-force mt-2"
            rel="noreferrer"
          >
            Open page
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default HookshotFeeds;
