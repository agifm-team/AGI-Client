import React, { useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/theme/material.css';

import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/lint.js';
import settings from '@src/client/state/settings';

function CodeEditor({
  value,
  mode,
  isOpen = true,
  lint = true,
  lineNumbers = true,
  gutters = ['CodeMirror-lint-markers'],

  onChange = null,
  onChanges = null,
  onBeforeChange = null,
  onCursorActivity = null,
  onKeyHandled = null,
  onInputRead = null,
  onElectricInput = null,
  onBeforeSelectionChange = null,
  onViewportChange = null,
  onSwapDoc = null,
  onGutterClick = null,
  onGutterContextMenu = null,
  onFocus = null,
  onBlur = null,
  onScroll = null,
  onRefresh = null,
  onOptionChange = null,
  onScrollCursorIntoView = null,
  onUpdate = null,
  onRenderLine = null,
  onDelete = null,
  onBeforeCursorEnter = null,
  onClear = null,
  onHide = null,
  onUnhide = null,
  onRedraw = null,
}) {
  const codeBase = useRef(null);
  const [code, setCode] = useState(null);
  const [, forceUpdate] = useReducer((count) => count + 1, 0);

  useEffect(() => {
    if (code) {
      // https://codemirror.net/5/doc/manual.html#events
      if (onChange) code.on('change', onChange);
      if (onChanges) code.on('changes', onChanges);
      if (onBeforeChange) code.on('beforeChange', onBeforeChange);
      if (onCursorActivity) code.on('cursorActivity', onCursorActivity);
      if (onKeyHandled) code.on('keyHandled', onKeyHandled);
      if (onInputRead) code.on('inputRead', onInputRead);
      if (onElectricInput) code.on('electricInput', onElectricInput);
      if (onBeforeSelectionChange) code.on('beforeSelectionChange', onBeforeSelectionChange);
      if (onViewportChange) code.on('viewportChange', onViewportChange);
      if (onSwapDoc) code.on('swapDoc', onSwapDoc);
      if (onGutterClick) code.on('gutterClick', onGutterClick);
      if (onGutterContextMenu) code.on('gutterContextMenu', onGutterContextMenu);
      if (onFocus) code.on('focus', onFocus);
      if (onBlur) code.on('blur', onBlur);
      if (onScroll) code.on('scroll', onScroll);
      if (onRefresh) code.on('refresh', onRefresh);
      if (onOptionChange) code.on('optionChange', onOptionChange);
      if (onScrollCursorIntoView) code.on('scrollCursorIntoView', onScrollCursorIntoView);
      if (onUpdate) code.on('update', onUpdate);
      if (onRenderLine) code.on('renderLine', onRenderLine);
      if (onDelete) code.on('delete', onDelete);
      if (onBeforeCursorEnter) code.on('beforeCursorEnter', onBeforeCursorEnter);
      if (onClear) code.on('clear', onClear);
      if (onHide) code.on('hide', onHide);
      if (onUnhide) code.on('unhide', onUnhide);
      if (onRedraw) code.on('redraw', onRedraw);

      return () => {
        if (code) {
          if (onChange) code.off('change', onChange);
          if (onChanges) code.off('changes', onChanges);
          if (onBeforeChange) code.off('beforeChange', onBeforeChange);
          if (onCursorActivity) code.off('cursorActivity', onCursorActivity);
          if (onKeyHandled) code.off('keyHandled', onKeyHandled);
          if (onInputRead) code.off('inputRead', onInputRead);
          if (onElectricInput) code.off('electricInput', onElectricInput);
          if (onBeforeSelectionChange) code.off('beforeSelectionChange', onBeforeSelectionChange);
          if (onViewportChange) code.off('viewportChange', onViewportChange);
          if (onSwapDoc) code.off('swapDoc', onSwapDoc);
          if (onGutterClick) code.off('gutterClick', onGutterClick);
          if (onGutterContextMenu) code.off('gutterContextMenu', onGutterContextMenu);
          if (onFocus) code.off('focus', onFocus);
          if (onBlur) code.off('blur', onBlur);
          if (onScroll) code.off('scroll', onScroll);
          if (onRefresh) code.off('refresh', onRefresh);
          if (onOptionChange) code.off('optionChange', onOptionChange);
          if (onScrollCursorIntoView) code.off('scrollCursorIntoView', onScrollCursorIntoView);
          if (onUpdate) code.off('update', onUpdate);
          if (onRenderLine) code.off('renderLine', onRenderLine);
          if (onDelete) code.off('delete', onDelete);
          if (onBeforeCursorEnter) code.off('beforeCursorEnter', onBeforeCursorEnter);
          if (onClear) code.off('clear', onClear);
          if (onHide) code.off('hide', onHide);
          if (onUnhide) code.off('unhide', onUnhide);
          if (onRedraw) code.off('redraw', onRedraw);
        }
      };
    }
  });

  setTimeout(() => {
    if (codeBase.current) {
      if (!isOpen && code) {
        code.setOption('mode', 'text/x-csrc');
        code.toTextArea();
        setCode(null);
      } else if (isOpen && !code) {
        // https://codemirror.net/5/theme/
        const themeId = settings.getThemeType();
        const systemTheme = settings.getSystemTheme();
        const theme =
          (systemTheme.enabled && systemTheme.isDark) ||
          themeId === 'theme-type-dark' ||
          themeId === 'theme-type-dark-solid' ||
          themeId === 'theme-type-dark2' ||
          themeId === 'theme-type-dark2-solid'
            ? 'material-darker'
            : 'material';

        setCode(
          CodeMirror.fromTextArea(codeBase.current, {
            theme,
            mode,
            lineNumbers,
            gutters,
            lint,
          }),
        );
      }
    }
  }, 1);

  return <textarea className="d-none" defaultValue={value} ref={codeBase} />;
}

CodeEditor.propTypes = {
  value: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  gutters: PropTypes.array,
  isOpen: PropTypes.bool,
  lint: PropTypes.bool,
  lineNumbers: PropTypes.bool,
  onChange: PropTypes.func,
  onChanges: PropTypes.func,
  onBeforeChange: PropTypes.func,
  onCursorActivity: PropTypes.func,
  onKeyHandled: PropTypes.func,
  onInputRead: PropTypes.func,
  onElectricInput: PropTypes.func,
  onBeforeSelectionChange: PropTypes.func,
  onViewportChange: PropTypes.func,
  onSwapDoc: PropTypes.func,
  onGutterClick: PropTypes.func,
  onGutterContextMenu: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onScroll: PropTypes.func,
  onRefresh: PropTypes.func,
  onOptionChange: PropTypes.func,
  onScrollCursorIntoView: PropTypes.func,
  onUpdate: PropTypes.func,
  onRenderLine: PropTypes.func,
  onDelete: PropTypes.func,
  onBeforeCursorEnter: PropTypes.func,
  onClear: PropTypes.func,
  onHide: PropTypes.func,
  onUnhide: PropTypes.func,
  onRedraw: PropTypes.func,
};

export default CodeEditor;
