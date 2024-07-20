import React from 'react';
import PropTypes from 'prop-types';
import { readImageUrl } from '@src/util/libs/mediaCache';
import Tooltip from '@src/app/atoms/tooltip/Tooltip';
import MxcUrl from '@src/util/libs/MxcUrl';

import { createTemporaryClient, startSsoLogin } from '../../../client/action/auth';

import Button from '../../atoms/button/Button';

function SSOButtons({ type, identityProviders, baseUrl, isRegister = false }) {
  const tempClient = createTemporaryClient(baseUrl);
  const mxcUrl = new MxcUrl(tempClient);
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
            <Tooltip placement="top" content={<div className="small">{idp.name}</div>}>
              <button
                key={idp.id}
                type="button"
                className="sso-btn"
                onClick={() => handleClick(idp.id)}
              >
                <img
                  className="sso-btn__img rounded-circle border border-bg mb-2"
                  src={readImageUrl(mxcUrl.toHttp(idp.icon))}
                  alt={idp.name}
                />
              </button>
            </Tooltip>
          ) : (
            <Button
              key={idp.id}
              className="sso-btn__text-only border border-bg mb-2"
              onClick={() => handleClick(idp.id)}
            >{`${!isRegister ? 'Login' : 'Register'} with ${idp.name}`}</Button>
          ),
        )}
    </center>
  );
}

SSOButtons.propTypes = {
  isRegister: PropTypes.bool,
  identityProviders: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  baseUrl: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['sso', 'cas']).isRequired,
};

export default SSOButtons;
