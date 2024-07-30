// import clone from 'clone';
import { serverDomain } from '@mods/agi-mod/socket';
import initMatrix, { fetchFn } from '@src/client/initMatrix';
import { objType } from 'for-promise/utils/lib.mjs';

export function duplicatorAgent(data) {
  return new Promise((resolve, reject) => {
    const username = initMatrix.matrixClient.getUserId();
    // const newData = clone(data);
    // newData.username = username;
    fetchFn(`https://bots.${serverDomain}/agent/duplicate/${username}`, {
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
    fetchFn(`https://bots.${serverDomain}/bots/restart/${botUsername}`, {
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

export const checkRoomAgents = (roomId, info) =>
  new Promise((resolve, reject) =>
    fetchFn(`https://bots.${serverDomain}/bots/${roomId}/check`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(info),
    })
      .then(async (res) => {
        try {
          const data = await res.json();
          if (objType(data, 'object')) {
            const result = [];
            for (const item in data) {
              if (typeof data[item] === 'boolean' && data[item]) {
                result.push(item);
              }
            }
            resolve(result);
          } else {
            resolve([]);
          }
        } catch (err) {
          reject(err);
        }
      })
      .catch(reject),
  );
