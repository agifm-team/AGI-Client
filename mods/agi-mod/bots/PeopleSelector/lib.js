// import clone from 'clone';
import { serverDomain } from '@mods/agi-mod/socket';
import initMatrix from '@src/client/initMatrix';

export function duplicatorAgent(data) {
  return new Promise((resolve, reject) => {
    const username = initMatrix.matrixClient.getUserId();
    // const newData = clone(data);
    // newData.username = username;
    fetch(`https://bots.${serverDomain}/agent/duplicate/${username}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(resolve)
      .catch(reject);
  });
}

export function reconnectAgent(botUsername) {
  return new Promise((resolve, reject) => {
    fetch(`https://bots.${serverDomain}/bots/restart/${botUsername}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then(resolve)
      .catch(reject);
  });
}
