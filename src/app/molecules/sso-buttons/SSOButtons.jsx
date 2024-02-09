import React from 'react';
import PropTypes from 'prop-types';

import { createTemporaryClient, startSsoLogin } from '../../../client/action/auth';

function SSOButtons({ type, identityProviders, baseUrl }) {
  const tempClient = createTemporaryClient(baseUrl);
  function handleClick(id) {
    startSsoLogin(baseUrl, type, id);
  }

  return identityProviders
    .sort((idp, idp2) => {
      if (typeof idp.icon !== 'string') return -1;
      return idp.name.toLowerCase() > idp2.name.toLowerCase() ? 1 : -1;
    })
    .map((idp) => (
      <a onClick={() => handleClick(idp.id)} className="nav-link text-bg-force" href="#">
        {idp.icon ? (
          <img
            className="img-fluid rounded-circle"
            src={tempClient.mxcUrlToHttp(idp.icon)}
            alt={idp.name}
          />
        ) : (
          // `Login with ${idp.name}`
          `Login`
        )}
      </a>
    ));
}

SSOButtons.propTypes = {
  identityProviders: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  baseUrl: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['sso', 'cas']).isRequired,
};

export default SSOButtons;
