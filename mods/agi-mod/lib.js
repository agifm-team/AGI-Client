import { defaultAvatar } from '@src/app/atoms/avatar/defaultAvatar';
import initMatrix from '@src/client/initMatrix';

import { serverDomain } from './socket';

const logoutUrl = `https://auth.${serverDomain}/realms/Multi/protocol/openid-connect/logout`;
const supabase = {
  general: 'pddqpwpqigtmyiolyvxk.supabase.co',
};

export function logout(/* redirect = true */) {
  /* return new Promise((resolve, reject) => {
        fetch(logoutUrl).then((data) => {
            if (redirect) global.location.reload();
            resolve(data);
        }).catch(reject);
    }); */
  return new Promise((resolve) => {
    window.open(logoutUrl, '_blank');
    resolve({});
  });
}

export function redirectLogout() {
  window.open(logoutUrl, '_self');
}

export function insertAgiAvatar(data, defaultItem = 1) {
  return typeof data.profile_photo === 'string' &&
    data.profile_photo.startsWith(`https://${supabase.general}/`)
    ? data.profile_photo
    : typeof data.avatar_mxc === 'string' && data.avatar_mxc.length
      ? initMatrix.matrixClient.mxcUrlToHttp(data.avatar_mxc)
      : typeof defaultItem === 'number'
        ? defaultAvatar(defaultItem)
        : null;
}

export { logoutUrl };
