import React, { lazy, Suspense } from 'react';
import $ from 'jquery';

import * as linkify from 'linkifyjs';
import linkifyHtml from 'linkify-html';
import Linkify from 'linkify-react';

import parse from 'html-react-parser';
import twemoji from 'twemoji';

import Img, { ImgJquery } from '@src/app/atoms/image/Image';
import { everyoneTags } from '@src/app/molecules/global-notification/KeywordNotification';

import { sanitizeText } from './sanitize';
import openTinyURL from './message/urlProtection';
import { tinyLinkifyFixer } from './clear-urls/clearUrls';
import envAPI from './libs/env';

// Register Protocols
linkify.registerCustomProtocol('matrix');
linkify.registerCustomProtocol('twitter');
linkify.registerCustomProtocol('steam');

linkify.registerCustomProtocol('ircs');
linkify.registerCustomProtocol('irc');

linkify.registerCustomProtocol('ftp');

let needRegisterExtraProtocol = true;
const registerExtraProtocols = () => {
  if (needRegisterExtraProtocol) {
    needRegisterExtraProtocol = false;
    if (envAPI.get('IPFS')) {
      linkify.registerCustomProtocol('ipfs');
    }

    if (envAPI.get('WEB3')) {
      linkify.registerCustomProtocol('bitcoin');
      linkify.registerCustomProtocol('dogecoin');
      linkify.registerCustomProtocol('monero');

      linkify.registerCustomProtocol('ethereum');
      linkify.registerCustomProtocol('web3');

      linkify.registerCustomProtocol('ar');
      linkify.registerCustomProtocol('lbry');
    }
  }
};

// Emoji Base
export const TWEMOJI_BASE_URL = './img/twemoji/';

// String Protocols
global.String.prototype.toUnicode = function () {
  let result = '';
  for (let i = 0; i < this.length; i++) {
    // Assumption: all characters are < 0xffff
    result += `\\u${`000${this[i].charCodeAt(0).toString(16)}`.substring(-4)}`;
  }
  return result;
};

global.String.prototype.emojiToCode = function () {
  return this.codePointAt(0).toString(16);
};

// Image fix
const ImageFix = {
  jquery: function () {
    const el = $(this);
    const dataMxEmoticon = el.attr('data-mx-emoticon') || el.prop('data-mx-emoticon');
    const className = el.attr('class');
    const src = el.attr('src');
    const alt = el.attr('alt');

    el.replaceWith(
      ImgJquery({
        isEmoji: true,
        dataMxEmoticon,
        className,
        src,
        alt,
      }),
    );
  },
  React: (attribs) => {
    const imgResult =
      attribs &&
      typeof attribs.src === 'string' &&
      (attribs.src.startsWith('mxc://') || attribs.src.startsWith('./')) ? (
        <Img
          isEmoji
          dataMxEmoticon={attribs['data-mx-emoticon']}
          className={attribs.class}
          src={attribs.src}
          alt={attribs.alt}
        />
      ) : (
        <span />
      );

    // Emoji data
    /* if (
      attribs['data-mx-emoticon'] ||
      (typeof attribs.class === 'string' && attribs.class.includes('emoji'))
    ) {
      return 
    } */

    return imgResult;
  },
};

// Tiny Math
const Math = lazy(() => import('../app/atoms/math/Math'));
const mathOptions = {
  replace: (node) => {
    const maths = node.attribs?.['data-mx-maths'];
    if (maths) {
      return (
        <Suspense fallback={<code>{maths}</code>}>
          <Math
            content={maths}
            throwOnError={false}
            errorColor="var(--tc-danger-normal)"
            displayMode={node.name === 'div'}
          />
        </Suspense>
      );
    } else if (node.type === 'tag' && node.name === 'img') return ImageFix.React(node.attribs);
    return null;
  },
};

const sendImg = {
  replace: (node) => {
    if (node.type === 'tag' && node.name === 'img') return ImageFix.React(node.attribs);
    return null;
  },
};

const tinyRender = {
  html:
    (type) =>
    ({ attributes, content }) => {
      if (tinyLinkifyFixer(type, content)) {
        let tinyAttr = '';
        for (const attr in attributes) {
          tinyAttr += ` ${attr}${attributes[attr].length > 0 ? `=${attributes[attr]}` : ''}`;
        }
        return `<a${tinyAttr}>${content}</a>`;
      }

      return content;
    },

  react:
    (type) =>
    ({ attributes, content }) => {
      if (tinyLinkifyFixer(type, content)) {
        const { href, ...props } = attributes;
        const result = (
          <a
            href={href}
            onClick={(e) => {
              e.preventDefault();
              openTinyURL($(e.target).attr('href'), $(e.target).attr('href'));
              return false;
            }}
            {...props}
            className="lk-href"
          >
            {content}
          </a>
        );

        return result;
      }

      return <>{content}</>;
    },
};

tinyRender.list = {
  react: {
    url: tinyRender.react('url'),
    mail: tinyRender.react('mail'),
    email: tinyRender.react('email'),
  },

  html: {
    url: tinyRender.html('url'),
    mail: tinyRender.html('mail'),
    email: tinyRender.html('email'),
  },
};

const everyoneRegexs = {};
for (const item in everyoneTags) {
  everyoneRegexs[item] = new RegExp(`\\${everyoneTags[item]}`, 'gi');
}

/**
 * @param {string} text - text to twemojify
 * @param {object|undefined} opts - options for tweomoji.parse
 * @param {boolean} [linkify=false] - convert links to html tags (default: false)
 * @param {boolean} [sanitize=true] - sanitize html text (default: true)
 * @param {boolean} [maths=false] - render maths (default: false)
 * @returns React component
 */
const twemojifyAction = (text, opts, linkifyEnabled, sanitize, maths, isReact) => {
  registerExtraProtocols();
  // Not String
  if (typeof text !== 'string') return text;

  // Content Prepare
  let msgContent = text;
  const options = opts ?? { base: TWEMOJI_BASE_URL };
  if (!options.base) {
    options.base = TWEMOJI_BASE_URL;
  }

  // Sanitize Filter
  if (sanitize) {
    msgContent = sanitizeText(msgContent);
  }

  // Emoji Parse
  msgContent = twemoji.parse(msgContent, options);
  for (const item in everyoneTags) {
    msgContent = msgContent.replace(
      everyoneRegexs[item],
      `<span class="everyone-mention" data-mx-ping>${everyoneTags[item]}</span>`,
    );
  }

  // Linkify Options
  const linkifyOptions = {
    defaultProtocol: 'https',
    rel: 'noreferrer noopener',
    target: '_blank',
  };

  // React Mode
  if (isReact) {
    const msgHtml = parse(msgContent, maths ? mathOptions : sendImg);

    // Insert Linkify
    if (linkifyEnabled) {
      // Render Data
      linkifyOptions.render = tinyRender.list.react;
      return (
        <span className="linkify-base">
          <Linkify options={linkifyOptions}>{msgHtml}</Linkify>
        </span>
      );
    }

    // Complete
    return <span className="linkify-base">{msgHtml}</span>;
  }

  // jQuery Mode

  // Insert Linkify
  if (linkifyEnabled) {
    // Render Data
    linkifyOptions.render = tinyRender.list.html;
    linkifyOptions.className = 'lk-href';

    // Insert Render
    msgContent = linkifyHtml(msgContent, linkifyOptions);
  }

  // Final Result
  msgContent = $('<span>', { class: 'linkify-base' }).html(msgContent);

  // Convert images
  const imgs = msgContent.find('img');
  imgs.each(ImageFix.jquery);

  // Fix Urls
  const tinyUrls = msgContent.find('.lk-href');
  tinyUrls.on('click', (event) => {
    const e = event.originalEvent;
    e.preventDefault();
    openTinyURL($(e.target).attr('href'), $(e.target).attr('href'));
    return false;
  });

  tinyUrls.each(() => $(this).attr('title') && $(this).tooltip());

  // Complete
  return msgContent;
};

// Functions
export function twemojify(text, opts, linkifyEnabled = false, sanitize = true) {
  return twemojifyAction(text, opts, linkifyEnabled, sanitize, false, false);
}

export function twemojifyReact(text, opts, linkifyEnabled = false, sanitize = true, maths = false) {
  return twemojifyAction(text, opts, linkifyEnabled, sanitize, maths, true);
}

const unicodeEmojiFix = (text) => {
  let code = text.toLowerCase();

  // Fix for "copyright" and "trademark" emojis
  if (code.substring(0, 2) === '00') {
    code = code.substring(2);

    // Fix for keycap emojis
    const regex = /-fe0f/i;
    code = code.replace(regex, '');
  }

  // Fix for "Eye in Speech Bubble" emoji
  if (code.includes('1f441')) {
    const regex = /-fe0f/gi;
    code = code.replace(regex, '');
  }

  return code;
};

export function twemojifyIcon(text, format = 'png', size = 72) {
  return `${TWEMOJI_BASE_URL}${size}x${size}/${unicodeEmojiFix(text)}.${format}`;
}

export function twemojifyUrl(text, format = 'png', size = 72) {
  return `${TWEMOJI_BASE_URL}${format !== 'svg' ? `${size}x${size}` : 'svg'}/${unicodeEmojiFix(text)}.${format}`;
}

export function twemojifyToUrl(text) {
  try {
    return twemojifyIcon(twemoji.convert.toCodePoint(text).toLowerCase());
  } catch {
    return '';
  }
}
