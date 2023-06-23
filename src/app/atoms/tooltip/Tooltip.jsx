import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip as BootstrapTooltip } from 'react-bootstrap';

function Tooltip({
  className, placement, content, delay, children, bsClass,
}) {

  const tooltip = (
    <BootstrapTooltip bsClass={bsClass} className={className ? `noselect ${className}` : 'noselect'}>{content}</BootstrapTooltip>
  );

  return (
    <OverlayTrigger delayShow={delay[0]} delayHide={delay[1]} placement={placement} overlay={tooltip}>
      {children}
    </OverlayTrigger>
  );

}

Tooltip.defaultProps = {
  bsClass: 'tooltip',
  placement: 'top',
  className: null,
  delay: [200, 0],
};

Tooltip.propTypes = {
  bsClass: PropTypes.string,
  className: PropTypes.string,
  placement: PropTypes.string,
  content: PropTypes.node.isRequired,
  delay: PropTypes.arrayOf(PropTypes.number),
  children: PropTypes.node.isRequired,
};

export default Tooltip;
