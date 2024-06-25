import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

import mobileEvents from '@src/util/libs/mobile';

import { twemojifyReact } from '../../../util/twemojify';

import Text from '../../atoms/text/Text';
import { MenuItem } from '../../atoms/context-menu/ContextMenu';
import { arrayItems as bsColorsArray } from '../../../util/styles-bootstrap';

function PWContentSelector({
  selected = false,
  variant = 'link btn-bg',
  iconSrc = 'none',
  type = 'button',
  onClick,
  children,
}) {
  const pwcsClass = selected ? ' pw-content-selector--selected' : '';
  return (
    <div className={`pw-content-selector${pwcsClass}`}>
      <MenuItem variant={variant} iconSrc={iconSrc} type={type} onClick={onClick}>
        {children}
      </MenuItem>
    </div>
  );
}

PWContentSelector.propTypes = {
  selected: PropTypes.bool,
  variant: PropTypes.oneOf(bsColorsArray),
  iconSrc: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit']),
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
};

function PopupWindow({
  isFullscreen = false,
  className = null,
  isOpen,
  title,
  contentTitle = null,
  drawer = null,
  onAfterClose = null,
  onRequestClose = null,
  children,
  classBody = null,
  size = null,
  id = null,
}) {
  const haveDrawer = drawer !== null;
  const cTitle = contentTitle !== null ? contentTitle : title;

  let finalTitle;

  if (typeof title !== 'undefined') {
    finalTitle = typeof title === 'string' ? twemojifyReact(title) : title;
  } else if (typeof cTitle !== 'undefined') {
    finalTitle =
      typeof cTitle === 'string' ? (
        <Text variant="h2" weight="medium" primary>
          {twemojifyReact(cTitle)}
        </Text>
      ) : (
        cTitle
      );
  }

  useEffect(() => {
    const closeByMobile = () => typeof onRequestClose === 'function' && onRequestClose();

    mobileEvents.on('backButton', closeByMobile);
    return () => {
      mobileEvents.off('backButton', closeByMobile);
    };
  });

  return (
    <Modal
      id={id}
      show={isOpen}
      onHide={onRequestClose}
      onExited={onAfterClose}
      backdrop={!isFullscreen}
      backdropClassName={`${isFullscreen ? 'modal-fullscreen ' : ''}${__ENV_APP__.ELECTRON_MODE ? 'root-electron-style' : ''}`}
      className={`${__ENV_APP__.ELECTRON_MODE ? 'root-electron-style ' : ''}${
        isFullscreen
          ? `full-screen-mode${__ENV_APP__.ELECTRON_MODE ? ' electron-full-screen-mode' : ''}`
          : null
      }`}
      dialogClassName={`${
        className === null
          ? `${isFullscreen ? 'modal-fullscreen ' : typeof size === 'string' ? `${size} ` : ''}`
          : `${typeof className === 'string' ? `${className} ` : ''}${isFullscreen ? 'modal-fullscreen ' : typeof size === 'string' ? `${size} ` : ''} `
      }modal-dialog-centered modal-dialog-scrollable modal-popup`}
    >
      {finalTitle ? (
        <Modal.Header className="noselect" closeButton>
          <Modal.Title className="h5 emoji-size-fix">{finalTitle}</Modal.Title>
        </Modal.Header>
      ) : null}

      <Modal.Body className={`bg-bg2${classBody ? ` ${classBody}` : ''}`}>
        {haveDrawer && { drawer }}
        {children}
      </Modal.Body>
    </Modal>
  );
}

PopupWindow.propTypes = {
  isFullscreen: PropTypes.bool,
  id: PropTypes.string,
  classBody: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.node,
  contentTitle: PropTypes.node,
  drawer: PropTypes.node,
  onAfterClose: PropTypes.func,
  onRequestClose: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export { PopupWindow as default, PWContentSelector };
