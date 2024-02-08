import React from 'react';

import PropTypes from 'prop-types';

import SSOButtons from '../../../molecules/sso-buttons/SSOButtons';

function Login({ loginFlow, baseUrl }) {
  const ssoProviders = loginFlow?.filter((flow) => flow.type === 'm.login.sso')[0];

  return (
    ssoProviders && (
      <SSOButtons
        type="sso"
        identityProviders={ssoProviders.identity_providers}
        baseUrl={baseUrl}
      />
    )
  );
}

Login.propTypes = {
  loginFlow: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  baseUrl: PropTypes.string.isRequired,
};

export default Login;
