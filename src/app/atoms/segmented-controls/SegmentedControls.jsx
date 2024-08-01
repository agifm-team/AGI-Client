import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import RawIcon from '../system-icons/RawIcon';

function SegmentedControls({
  disabled = false,
  selected,
  segments,
  onSelect,
  onEmpty,
  className,
  type = 'buttons',
  iconSrc,
  chooseText = 'Choose...',
}) {
  const [select, setSelect] = useState(selected);

  function selectSegment(segmentIndex, segValue) {
    setSelect(segmentIndex);
    onSelect(segmentIndex, segValue);
  }

  useEffect(() => {
    setSelect(selected);
  }, [selected]);

  return type === 'buttons' ? (
    <div className={`btn-group noselect ${className}`} role="group">
      {segments.map((segment, index) => (
        <button
          seg_value={segment.value}
          key={Math.random().toString(20).substring(2, 6)}
          className={`btn btn-theme ${select === index ? ' active' : ''}${disabled ? ' disabled' : ''}`}
          type="button"
          onClick={() => selectSegment(index)}
          disabled={disabled}
        >
          {segment.iconSrc && <RawIcon size="small" src={segment.iconSrc} />}
          {segment.text && <small>{segment.text}</small>}
        </button>
      ))}
    </div>
  ) : type === 'select' ? (
    <select
      disabled={disabled}
      value={select}
      className={`form-select form-control-bg${disabled ? ' disabled' : ''}`}
      onChange={(event) => {
        const el = $(event.target);
        const value = $(event.target).val();
        const segValue = $(event.target).attr('seg_value');
        if (typeof value === 'string' && value.length > 0) {
          const index = Number(value);
          if (!Number.isNaN(index) && Number.isFinite(index) && index > -1) {
            selectSegment(index, segValue);
          } else if (typeof onEmpty === 'function') {
            onEmpty();
          }
        } else if (typeof onEmpty === 'function') {
          onEmpty();
        }
      }}
    >
      <option>
        {iconSrc && <RawIcon size="small" src={iconSrc} />}
        <small>{chooseText}</small>
      </option>

      {segments.map((segment, index) => (
        <option value={index} key={Math.random().toString(20).substring(2, 6)}>
          {segment.iconSrc && <RawIcon size="small" src={segment.iconSrc} />}
          {segment.text && <small>{segment.text}</small>}
        </option>
      ))}
    </select>
  ) : null;
}

SegmentedControls.propTypes = {
  disabled: PropTypes.bool,
  iconSrc: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  selected: PropTypes.number.isRequired,

  segments: PropTypes.arrayOf(
    PropTypes.shape({
      iconSrc: PropTypes.string,
      text: PropTypes.string,
    }),
  ).isRequired,

  onSelect: PropTypes.func.isRequired,
  onEmpty: PropTypes.func,
};

export default SegmentedControls;
