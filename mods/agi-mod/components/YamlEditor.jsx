import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// import CodeMirror from '@uiw/react-codemirror';
// import { yaml as yamlLang } from '@codemirror/lang-yaml';
import settings from '@src/client/state/settings';
// import yaml from 'js-yaml';

/*
{__ENV_APP__.MODE === 'development' ? (
                    <>
                      <hr />

                      <YamlEditor
                        isOpen={isOpen}
                        value={` doe: "a deer, a female deer"
 ray: "a drop of golden sun"
 pi: 3.14159
 xmas: true
 french-hens: 3
 calling-birds:
   - huey
   - dewey
   - louie
   - fred
 xmas-fifth-day:
   calling-birds: four
   french-hens: 3
   golden-rings: 5
   partridges:
     count: 1
     location: "a pear tree"
   turtle-doves: two`}
                      />
                    </>
                  ) : null}
*/

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
  /* return (
    <CodeMirror
      value={tvalue}
      theme={theme}
      height="200px"
      extensions={[yamlLang()]}
      onChange={onChange}
    />
  ); */
}

// Props
YamlEditor.propTypes = {
  value: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
};

export default YamlEditor;
