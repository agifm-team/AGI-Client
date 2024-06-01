import React from 'react';
import PropTypes from 'prop-types';

import yaml from 'js-yaml';

import CodeEditor from './CodeEditor';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/lint/yaml-lint';

window.jsyaml = yaml;

function YamlEditor({ value = '', isOpen = true }) {
  return (
    <CodeEditor
      isOpen={isOpen}
      value={value}
      mode="yaml"
      onChange={(code) => {
        // const content = code.getValue();
        /* try {
                            const _yaml = yaml.loadAll(content);
                            console.log(_yaml);
                        } catch (e) {
                            console.error(e);
                        } */
      }}
    />
  );
}

// Props
YamlEditor.propTypes = {
  value: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
};

export default YamlEditor;
