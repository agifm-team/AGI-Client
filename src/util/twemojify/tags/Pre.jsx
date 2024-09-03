import React from 'react';
import HighlightCode from '@src/app/organisms/view-source/highlight';
import tinyFixScrollChat from '@src/app/molecules/media/mediaFix';

// Image fix
const PRE = {
  React: ({ children }) => {
    if (
      Array.isArray(children) &&
      children.length === 1 &&
      Array.isArray(children[0].children) &&
      children[0].children.length > 0
    ) {
      let code = '';
      for (const item in children[0].children) {
        code += children[0].children[item].data;
      }

      return (
        <pre>
          <HighlightCode
            code={code}
            className="hljs-fix chatbox-size-fix"
            onLoad={() => tinyFixScrollChat()}
          />
        </pre>
      );
    }
    return null;
  },
};

export default PRE;
