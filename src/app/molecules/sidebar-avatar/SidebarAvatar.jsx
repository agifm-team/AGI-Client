import React from 'react';
import PropTypes from 'prop-types';

import { twemojifyReact } from '../../../util/twemojify';

import Text from '../../atoms/text/Text';
import Tooltip from '../../atoms/tooltip/Tooltip';
import { blurOnBubbling } from '../../atoms/button/script';

const SidebarAvatar = React.forwardRef(
  (
    {
      id = null,
      className = null,
      tooltip,
      active = false,
      onClick = null,
      onContextMenu = null,
      avatar,
      notificationBadge = null,
    },
    ref,
  ) => {
    const classes = ['sidebar-avatar', 'position-relative'];
    if (active) classes.push('sidebar-avatar--active');
    if (className) classes.push(className);

    return (
      <Tooltip content={<Text variant="b1">{twemojifyReact(tooltip)}</Text>} placement="right">
        <button
          id={id}
          ref={ref}
          className={classes.join(' ')}
          type="button"
          onMouseUp={(e) => blurOnBubbling(e, '.sidebar-avatar')}
          onClick={onClick}
          onContextMenu={onContextMenu}
        >
          {avatar}
          {notificationBadge}
        </button>
      </Tooltip>
    );
  },
);

SidebarAvatar.propTypes = {
  className: PropTypes.string,
  tooltip: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onContextMenu: PropTypes.func,
  avatar: PropTypes.node.isRequired,
  notificationBadge: PropTypes.node,
};

export default SidebarAvatar;
