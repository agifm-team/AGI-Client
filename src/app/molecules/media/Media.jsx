import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Img from '@src/app/atoms/image/Image';
import initMatrix, { fetchFn } from '@src/client/initMatrix';
import blobUrlManager from '@src/util/libs/blobUrlManager';

import { BlurhashCanvas } from 'react-blurhash';
import imageViewer from '../../../util/imageViewer';
import Tooltip from '../../atoms/tooltip/Tooltip';
import Text from '../../atoms/text/Text';
import IconButton from '../../atoms/button/IconButton';
import Spinner from '../../atoms/spinner/Spinner';

import { getBlobSafeMimeType } from '../../../util/mimetypes';
import { mediaFix } from './mediaFix';

async function getUrl(contentType, link, type, decryptData, roomId /* , threadId */) {
  try {
    const blobSettings = {
      freeze: true,
    };

    if (contentType === 'image' || contentType === 'sticker' || contentType === 'videoThumb') {
      blobSettings.group = `mxcMedia:${link}`;
    } else {
      blobSettings.group = `roomMedia:${roomId}`;
      // blobSettings.group = `roomMedia:${roomId}${typeof threadId === 'string' ? `:${threadId}` : ''}`,
    }

    blobSettings.id = `${blobSettings.group}:${link}`;
    const resultById = blobUrlManager.getById(blobSettings.id);
    if (!resultById) {
      const blob = await initMatrix.mxcUrl.focusFetchBlob(link, type, decryptData);
      const result = await blobUrlManager.insert(blob, blobSettings);
      return result;
    } else {
      return resultById;
    }
  } catch (e) {
    console.error(e);
    return link;
  }
}

function getNativeHeight(width, height, maxWidth = 296) {
  const scale = maxWidth / width;
  const result = scale * height;
  if (typeof result === 'number' && !Number.isNaN(result)) {
    return scale * height;
  }
  return '';
}

function FileHeader({ name, link = null, external = false, file = null, type, roomId, threadId }) {
  const [url, setUrl] = useState(null);

  async function getFile() {
    const myUrl = await getUrl('file', link, type, file, roomId, threadId);
    setUrl(myUrl);
  }

  async function handleDownload(e) {
    if (file !== null && url === null) {
      e.preventDefault();
      await getFile();
      e.target.click();
    }
  }

  return (
    <div className="file-header">
      <Text className="file-name" variant="b3">
        {name}
      </Text>
      {link !== null && (
        <>
          {!__ENV_APP__.ELECTRON_MODE && external && (
            <IconButton
              size="extra-small"
              tooltip="Open in new tab"
              fa="fa-solid fa-arrow-up-right-from-square"
              onClick={() => window.open(url || link)}
            />
          )}
          <a href={url || link} download={name} target="_blank" rel="noreferrer">
            <IconButton
              size="extra-small"
              tooltip="Download"
              fa="fa-solid fa-download"
              onClick={handleDownload}
            />
          </a>
        </>
      )}
    </div>
  );
}

FileHeader.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string,
  external: PropTypes.bool,
  file: PropTypes.shape({}),
  type: PropTypes.string.isRequired,
};

function File({ name, link, file = null, type = '', roomId, threadId }) {
  return (
    <div className="file-container">
      <FileHeader
        roomId={roomId}
        threadId={threadId}
        name={name}
        link={link}
        file={file}
        type={type}
      />
    </div>
  );
}

File.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  type: PropTypes.string,
  file: PropTypes.shape({}),
};

function Image({
  name,
  roomId,
  threadId,
  width = null,
  height = null,
  link,
  file = null,
  type = '',
  blurhash = '',
  className = null,
  classImage = null,
  ignoreContainer = false,
  maxWidth = 296,
}) {
  const [url, setUrl] = useState(null);
  const [blur, setBlur] = useState(true);
  const [lightbox, setLightbox] = useState(false);

  const itemEmbed = useRef(null);
  const [embedHeight, setEmbedHeight] = useState(null);

  useEffect(() => {
    let unmounted = false;
    async function fetchUrl() {
      const myUrl = await getUrl('image', link, type, file, roomId, threadId);
      if (unmounted) {
        blobUrlManager.delete(myUrl);
        return;
      }
      setUrl(myUrl);
    }
    fetchUrl();
    return () => {
      unmounted = true;
    };
  }, []);

  const toggleLightbox = () => {
    if (!url) return;
    setLightbox(!lightbox);
  };

  const imgHeight = width !== null ? getNativeHeight(width, height, maxWidth) : 200;

  const imgData = url !== null && (
    <div
      style={{
        minHeight: imgHeight,
      }}
    >
      <Img
        className={`${classImage}${ignoreContainer ? ` ${className}` : ''}`}
        draggable="false"
        style={{
          display: blur ? 'none' : 'unset',
          height: imgHeight,
        }}
        onLoad={(event) => {
          mediaFix(itemEmbed, embedHeight, setEmbedHeight);
          setBlur(false);
          let imageLoaded = false;
          if (!imageLoaded && event.target) {
            imageLoaded = true;
            const img = $(event.target);
            const imgAction = () => {
              imageViewer({ lightbox, imgQuery: img, name });
            };

            img.off('click', imgAction);
            img.on('click', imgAction);
          }
        }}
        src={url || link}
        alt={name}
      />
    </div>
  );

  useEffect(() => mediaFix(itemEmbed, embedHeight, setEmbedHeight));
  // tinyFixScrollChat();

  if (!ignoreContainer) {
    return (
      <div className={`file-container${className ? ` ${className}` : ''}`}>
        <div
          style={{ minHeight: imgHeight }}
          className="image-container"
          role="button"
          tabIndex="0"
          onClick={toggleLightbox}
          onKeyDown={toggleLightbox}
        >
          {blurhash && blur && <BlurhashCanvas hash={blurhash} punch={1} />}
          {imgData}
        </div>
      </div>
    );
  }

  return imgData;
}

Image.propTypes = {
  maxWidth: PropTypes.number,
  ignoreContainer: PropTypes.bool,
  name: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  link: PropTypes.string.isRequired,
  file: PropTypes.shape({}),
  type: PropTypes.string,
  className: PropTypes.string,
  classImage: PropTypes.string,
  blurhash: PropTypes.string,
};

function Sticker({
  name,
  height = null,
  width = null,
  link,
  file = null,
  type = '',
  roomId,
  threadId,
}) {
  const [url, setUrl] = useState(null);

  const itemEmbed = useRef(null);
  const [embedHeight, setEmbedHeight] = useState(null);

  useEffect(() => {
    let unmounted = false;
    async function fetchUrl() {
      const myUrl = await getUrl('sticker', link, type, file, roomId, threadId);
      if (unmounted) {
        blobUrlManager.delete(myUrl);
        return;
      }
      setUrl(myUrl);
    }
    fetchUrl();
    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => mediaFix(itemEmbed, embedHeight, setEmbedHeight));
  const stickerStyle = { height: width !== null ? getNativeHeight(width, height, 170) : 'unset' };

  return (
    <Tooltip placement="top" content={<div className="small">{name}</div>}>
      <div className="sticker-container" style={stickerStyle}>
        {url !== null && (
          <Img
            isSticker
            style={typeof stickerStyle.height === 'number' ? stickerStyle : null}
            src={url || link}
            alt={name}
          />
        )}
      </div>
    </Tooltip>
  );
}

Sticker.propTypes = {
  name: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  link: PropTypes.string.isRequired,
  file: PropTypes.shape({}),
  type: PropTypes.string,
};

function Audio({ name, link, type = '', file = null, roomId, threadId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [url, setUrl] = useState(null);

  const itemEmbed = useRef(null);
  const [embedHeight, setEmbedHeight] = useState(null);

  async function loadAudio() {
    const myUrl = await getUrl('audio', link, type, file, roomId, threadId);
    setUrl(myUrl);
    setIsLoading(false);
    setIsLoaded(true);
  }
  function handlePlayAudio() {
    setIsLoading(true);
    loadAudio();
  }

  useEffect(() => mediaFix(itemEmbed, embedHeight, setEmbedHeight, isLoaded));
  return (
    <div ref={itemEmbed} className="file-container">
      <FileHeader
        threadId={threadId}
        roomId={roomId}
        name={name}
        link={file !== null ? url : url || link}
        type={type}
        external
      />
      <div className="audio-container">
        {url === null && isLoading && <Spinner size="small" />}
        {url === null && !isLoading && (
          <IconButton onClick={handlePlayAudio} tooltip="Play audio" fa="fa-solid fa-circle-play" />
        )}
        {url !== null && (
          <audio autoPlay controls>
            <source src={url} type={getBlobSafeMimeType(type)} />
          </audio>
        )}
      </div>
    </div>
  );
}

Audio.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  type: PropTypes.string,
  file: PropTypes.shape({}),
};

function Video({
  name,
  roomId,
  threadId,
  link,
  thumbnail = null,
  thumbnailFile = null,
  thumbnailType = null,
  width = null,
  height = null,
  file = null,
  type = '',
  blurhash = null,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [url, setUrl] = useState(null);
  const [thumbUrl, setThumbUrl] = useState(null);
  const [blur, setBlur] = useState(true);

  const itemEmbed = useRef(null);
  const [embedHeight, setEmbedHeight] = useState(null);

  useEffect(() => {
    let unmounted = false;
    async function fetchUrl() {
      const myThumbUrl = await getUrl(
        'videoThumb',
        thumbnail,
        thumbnailType,
        thumbnailFile,
        roomId,
        threadId,
      );
      if (unmounted) {
        blobUrlManager.delete(myThumbUrl);
        return;
      }
      setThumbUrl(myThumbUrl);
    }

    if (thumbnail !== null) fetchUrl();
    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => mediaFix(itemEmbed, embedHeight, setEmbedHeight, isLoaded));
  const loadVideo = async () => {
    const myUrl = await getUrl('video', link, type, file, roomId, threadId);
    setUrl(myUrl);
    setIsLoading(false);
    setIsLoaded(true);
  };

  const handlePlayVideo = () => {
    setIsLoading(true);
    loadVideo();
  };

  return (
    <div ref={itemEmbed} className={`file-container${url !== null ? ' file-open' : ''}`}>
      <FileHeader
        threadId={threadId}
        roomId={roomId}
        name={name}
        link={file !== null ? url : url || link}
        type={type}
        external
      />
      {url === null ? (
        <div className="video-container">
          {!isLoading && (
            <IconButton
              onClick={handlePlayVideo}
              tooltip="Play video"
              fa="fa-solid fa-circle-play"
            />
          )}
          {blurhash && blur && <BlurhashCanvas hash={blurhash} punch={1} />}
          {thumbUrl !== null && (
            <Img
              style={{ display: blur ? 'none' : 'unset' }}
              src={thumbUrl}
              onLoad={() => setBlur(false)}
              alt={name}
            />
          )}
          {isLoading && <Spinner size="small" />}
        </div>
      ) : (
        <div className="ratio ratio-16x9 video-base">
          <video srcwidth={width} srcheight={height} autoPlay controls poster={thumbUrl}>
            <source src={url} type={getBlobSafeMimeType(type)} />
          </video>
        </div>
      )}
    </div>
  );
}

Video.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  thumbnailFile: PropTypes.shape({}),
  thumbnailType: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  file: PropTypes.shape({}),
  type: PropTypes.string,
  blurhash: PropTypes.string,
};

export { File, Image, Sticker, Audio, Video };
