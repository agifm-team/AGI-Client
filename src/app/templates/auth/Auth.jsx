import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import * as auth from '../../../client/action/auth';
import cons from '../../../client/state/cons';
import { getUrlParams } from '../../../util/common';
import Avatar from '../../atoms/avatar/Avatar';

import LoadingScreen from './modules/LoadingScreen';
import AuthCard from './modules/AuthCard';
import Welcome from '../../../../mods/agi-mod/bots/Welcome';
import ElectronSidebar from '../client/ElectronSidebar';

function Auth({ isDevToolsOpen = false }) {
  const [loginToken, setLoginToken] = useState(getUrlParams('loginToken'));

  useEffect(() => {
    const authSync = async () => {
      if (!loginToken) return;
      if (localStorage.getItem(cons.secretKey.BASE_URL) === undefined) {
        setLoginToken(null);
        return;
      }
      const baseUrl = localStorage.getItem(cons.secretKey.BASE_URL);
      try {
        await auth.loginWithToken(baseUrl, loginToken);

        const { href } = window.location;
        window.location.replace(href.slice(0, href.indexOf('?')));
      } catch {
        setLoginToken(null);
      }
    };

    authSync();
  }, []);

  return (
    <>
      {loginToken && <LoadingScreen message="Redirecting..." />}
      {
        !loginToken && (
          <>
            <AuthCard />
            <Welcome isGuest />
          </>
        )
      }
    </>
  );
}

Auth.propTypes = {
  isDevToolsOpen: PropTypes.bool,
};

export default Auth;
