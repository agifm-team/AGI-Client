import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WelcomePage from '@mods/WelcomePage';
import storageManager from '@src/util/libs/Localstorage';
import urlParams from '@src/util/libs/urlParams';

import ProxyModal from '@src/app/organisms/proxy-modal/ProxyModal';
import { canProxy } from '@src/util/libs/proxy';
import { openProxyModal } from '@src/client/action/navigation';

import * as auth from '../../../client/action/auth';
import cons from '../../../client/state/cons';
import { getUrlParams } from '../../../util/common';
import Avatar from '../../atoms/avatar/Avatar';

import LoadingScreen from './modules/LoadingScreen';
import AuthCard from './modules/AuthCard';
import Welcome from '../../../../mods/agi-mod/bots/Welcome';
import ElectronSidebar from '../client/ElectronSidebar';
import { AuthDivBaseWithBanner } from './modules/AuthDivBase';
import LoadingPage, { setLoadingPage } from '../client/Loading';

function Auth({ isDevToolsOpen = false }) {
  const [loginToken, setLoginToken] = useState(getUrlParams('loginToken'));
  const [type, setType] = useState('login');
  const [isWelcome, setIsWelcome] = useState(WelcomePage.enabled);

  useEffect(() => {
    const authSync = async () => {
      if (__ENV_APP__.GUEST_ACCOUNT) {
        const joinGuestMode = async () => {
          setLoadingPage('Joining...');
          try {
            const baseUrl = `https://${ENV.HOMESERVER_LIST[0]}`;
            const tempClient = auth.createTemporaryClient(baseUrl);
            const { user_id, device_id, access_token } = await tempClient.registerGuest();
            auth.updateLocalStore(access_token, device_id, user_id, baseUrl, true);
            window.location.reload();
            return true;
          } catch (err) {
            console.error(err);
            alert(err.message);
            setLoadingPage(false);
            return false;
          }
        };

        const roomId = urlParams.get('room_id');
        const ENV = __ENV_APP__.LOGIN ?? {};
        if (
          !ENV.ALLOW_CUSTOM_HOMESERVERS &&
          Array.isArray(ENV.HOMESERVER_LIST) &&
          ENV.HOMESERVER_LIST.length === 1 &&
          typeof ENV.HOMESERVER_LIST[0] === 'string' &&
          ENV.HOMESERVER_LIST[0].length > 0 &&
          typeof roomId === 'string' &&
          roomId.length > 0
        ) {
          const guestSuccess = await joinGuestMode();
          if (guestSuccess) return;
        }
      }

      if (!loginToken) return;
      if (storageManager.getItem(cons.secretKey.BASE_URL) === undefined) {
        setLoginToken(null);
        return;
      }
      const baseUrl = storageManager.getItem(cons.secretKey.BASE_URL);
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

  const showLoginPage = !isWelcome || !WelcomePage.html || loginToken;
  return (
    <>
      <LoadingPage />
      {loginToken && <LoadingScreen message="Redirecting..." />}
      {!loginToken && (
        <>
          <AuthCard />
          <Welcome isGuest />
        </>
      )}
    </>
  );
}

Auth.propTypes = {
  isDevToolsOpen: PropTypes.bool,
};

export default Auth;
