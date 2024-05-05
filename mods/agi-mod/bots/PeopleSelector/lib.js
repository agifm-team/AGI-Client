import { serverDomain } from '@mods/agi-mod/socket';
// import initMatrix from '@src/client/initMatrix';

export function duplicatorAgent(userId, botId) {
  return new Promise((resolve, reject) => {
    fetch(`https://bots.${serverDomain}/agent/duplicate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify({
        username: userId,
        // author: initMatrix.matrixClient.getUserId(),
        agent_id: botId,
      }),
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
