import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import CodeMirror from '@uiw/react-codemirror';
import { yaml as yamlLang } from '@codemirror/lang-yaml';
import settings from '@src/client/state/settings';
import yaml from 'js-yaml';

function YamlEditor({ value = '', isOpen = true }) {
  const [tvalue, setValue] = useState(value);
  const [theme, setTheme] = useState(null);

  const onChange = useCallback((val, viewUpdate) => {
    try {
      const _yaml = yaml.loadAll(val);
      console.log(_yaml);
    } catch (e) {
      console.error(e);
    }
    setValue(val);
  }, []);

  useEffect(() => {
    const themeId = settings.getThemeType();
    const systemTheme = settings.getSystemTheme();
    const theTheme =
      (systemTheme.enabled && systemTheme.isDark) ||
      themeId === 'dark' ||
      themeId === 'dark-solid' ||
      themeId === 'dark2' ||
      themeId === 'dark2-solid'
        ? 'dark'
        : 'light';

    if (theTheme !== theme) setTheme(theTheme);
  });

  // https://uiwjs.github.io/react-codemirror/
  return (
    <CodeMirror
      value={tvalue}
      theme={theme}
      height="200px"
      extensions={[yamlLang()]}
      onChange={onChange}
    />
  );
}

// Props
YamlEditor.propTypes = {
  value: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
};

export default YamlEditor;
