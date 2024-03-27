import React from 'react';
import PropTypes from 'prop-types';
import { readImageUrl } from '@src/util/libs/mediaCache';

import { createTemporaryClient, startSsoLogin } from '../../../client/action/auth';

import Button from '../../atoms/button/Button';

function SSOButtons({ type, identityProviders, baseUrl }) {
  const tempClient = createTemporaryClient(baseUrl);
  function handleClick(id) {
    startSsoLogin(baseUrl, type, id);
  }
  return (
    <center className="sso-buttons">
      {identityProviders
        .sort((idp, idp2) => {
          if (typeof idp.icon !== 'string') return -1;
          return idp.name.toLowerCase() > idp2.name.toLowerCase() ? 1 : -1;
        })
        .map((idp) =>
          idp.icon ? (
            <button
              key={idp.id}
              type="button"
              className="sso-btn"
              onClick={() => handleClick(idp.id)}
            >
              <img
                className="sso-btn__img rounded-circle border border-bg mb-2"
                src={readImageUrl(tempClient.mxcUrlToHttp(idp.icon))}
                alt={idp.name}
              />
            </button>
          ) : (
            <Button
              key={idp.id}
              className="sso-btn__text-only border border-bg mb-2"
              onClick={() => handleClick(idp.id)}
            >{`Login with ${idp.name}`}</Button>
          ),
        )}
    </center>
  );
}

SSOButtons.propTypes = {
  identityProviders: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  baseUrl: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['sso', 'cas']).isRequired,
};

export default SSOButtons;
