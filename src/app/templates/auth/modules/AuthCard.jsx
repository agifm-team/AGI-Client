import React, { useState } from 'react';

import Homeserver from './Homeserver';
import Login from './Login';

global.authPublicData = {};
function AuthCard() {
  const [hsConfig, setHsConfig] = useState(null);

  const handleHsChange = (info) => {
    setHsConfig(info);
  };

  global.authPublicData.register = { params: hsConfig?.register?.params };

  return (
    <>
      <Homeserver onChange={handleHsChange} />

      {hsConfig !== null && (
        <nav className="navbar navbar-expand-lg bg-bg border-bottom border-bg fixed-top">
          <div className="container-fluid">
            <a className="navbar-brand text-bg-force">
              {' '}
              <img
                src="./img/png/cinny.png"
                alt="Logo"
                width="24"
                height="24"
                class="d-inline-block align-text-top me-2"
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

export default AuthCard;
