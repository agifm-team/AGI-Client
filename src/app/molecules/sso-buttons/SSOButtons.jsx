import React from 'react';
import PropTypes from 'prop-types';

import Img from '@src/app/atoms/image/Image';
import Tooltip from '@src/app/atoms/tooltip/Tooltip';
import MxcUrl from '@src/util/libs/MxcUrl';
import { setLoadingPage } from '@src/app/templates/client/Loading';

import {
  createTemporaryClient,
  startSsoLogin,
  loginWithToken,
  updateLocalStore,
} from '../../../client/action/auth';

import Button from '../../atoms/button/Button';

function SSOButtons({ type, identityProviders, baseUrl, isRegister = false }) {
  const tempClient = createTemporaryClient(baseUrl);
  const mxcUrl = new MxcUrl(tempClient);
  function handleClick(id) {
    startSsoLogin(baseUrl, type, id);
  }
  return (
    <center className="sso-buttons noselect">
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
                <Img
                  customMxcUrl={mxcUrl}
                  className="sso-btn__img rounded-circle border border-bg mb-2"
                  src={mxcUrl.toHttp(idp.icon)}
                  alt={idp.name}
                />
              </button>
            </Tooltip>
          ) : (
            <Button
              key={idp.id}
              className="sso-btn__text-only border border-bg mb-2 mx-2"
              onClick={() => handleClick(idp.id)}
            >{`${!isRegister ? 'Login' : 'Register'} with ${idp.name}`}</Button>
          ),
        )}
      {__ENV_APP__.GUEST_ACCOUNT && (
        <Button
          className="sso-btn__text-only border border-bg mb-2 mx-2"
          onClick={async () => {
            setLoadingPage('Joining...');
            try {
              const tempClient = createTemporaryClient(baseUrl);
              const { user_id, device_id, access_token } = await tempClient.registerGuest();
              updateLocalStore(access_token, device_id, user_id, baseUrl, true);
              window.location.reload();
            } catch (err) {
              console.error(err);
              alert(err.message);
              setLoadingPage(false);
            }
          }}
        >{`Login with Guest`}</Button>
      )}
    </center >
  );
}

SSOButtons.propTypes = {
  isRegister: PropTypes.bool,
  identityProviders: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  baseUrl: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['sso', 'cas']).isRequired,
};

export default SSOButtons;
