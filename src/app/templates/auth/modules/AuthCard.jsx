import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { objType } from 'for-promise/utils/lib.mjs';

import hsWellKnown from '@src/util/libs/HsWellKnown';
import Img from '@src/app/atoms/image/Image';

import Homeserver from './Homeserver';
import Login from './Login';

if (__ENV_APP__.MODE === 'development') global.authPublicData = {};
function AuthCard({ type = 'login', setType }) {
  const [hsConfig, setHsConfig] = useState(null);

  useEffect(() => {
    const handleHsChange = (info) => setHsConfig(info);
    hsWellKnown.on('changeData', handleHsChange);
    return () => {
      hsWellKnown.off('changeData', handleHsChange);
    };
  });

  if (__ENV_APP__.MODE === 'development')
    global.authPublicData.register = { params: hsConfig?.register?.params };
  return (
    <>
      <Homeserver />

      {objType(hsConfig, 'object') &&
        objType(hsConfig.login, 'object') &&
        Array.isArray(hsConfig.login.flows) &&
        hsConfig.baseUrl && (
          <nav className="navbar navbar-expand-lg bg-bg border-bottom border-bg fixed-top">
            <div className="container-fluid">
              <a className="navbar-brand text-bg-force">
                {' '}
                <Img
                  src="./img/png/cinny.png"
                  alt="Logo"
                  width="24"
                  height="24"
                  className="d-inline-block align-text-top me-2"
                />
                {__ENV_APP__.INFO.name}
              </a>
              <div className="navbar-nav small">
                <Login
                  hsConfig={hsConfig}
                  loginFlow={hsConfig.login.flows}
                  baseUrl={hsConfig.baseUrl}
                />
              </div>
            </div>
          </nav>
        )}
    </>
  );
}

AuthCard.propTypes = {
  type: PropTypes.string.isRequired,
  setType: PropTypes.func.isRequired,
};

export default AuthCard;
