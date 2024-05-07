import { serverDomain } from '@mods/agi-mod/socket';
import initMatrix from '@src/client/initMatrix';

export function duplicatorAgent(userId, botId) {
  return new Promise((resolve, reject) => {
    const username = initMatrix.matrixClient.getUserId();
    /*
    "desc": "My new workflow",
    "name": "devin",
    "tags": [
      "devin"
    ],
    "type": "WORKFLOW",
    "avatar_mxc": null,
    "profile_photo": null,
    "prompt": null,
    "llmModel": null
    */
    fetch(`https://bots.${serverDomain}/agent/duplicate/${username}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify({
        username,
        bot_username: userId,
        id: botId,
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
