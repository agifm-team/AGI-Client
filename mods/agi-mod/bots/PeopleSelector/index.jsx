import defaultAvatar from '@src/app/atoms/avatar/defaultAvatar';

import { insertAgiAvatar } from '@mods/agi-mod/lib';
import tinyAPI from '@src/util/mods';
import initMatrix from '@src/client/initMatrix';
import { objType } from '@src/util/tools';

import { serverAddress } from '../../socket';
import PeopleSelector from './Item';

let tinyData = null;
function updateAgentsList() {
  return new Promise((resolve) => {
    fetch(`${serverAddress}list/${initMatrix.matrixClient.getUserId()}`, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((newData) => {
        tinyData = newData;
        resolve();
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
        resolve();
      });
  });
}

let customItems = [];
export default function startPeopleSelector() {
  // Members List
  updateAgentsList();
  tinyAPI.on('roomMembersOptions', (data, items) => {
    updateAgentsList();

    customItems = [];
    if (Array.isArray(tinyData)) {
      for (const item in tinyData) {
        if (objType(tinyData[item], 'object')) {
          const newData = {
            // name: tinyData[item].agent_name,
            name: tinyData[item].bot_username,

            peopleRole: 'Bot',
            powerLevel: undefined,
            customData: tinyData[item].customData,
            userId: tinyData[item].bot_username,
            username: tinyData[item].bot_username,

            customClick: (event) => {
              event.preventDefault();
            },
            customSelector: PeopleSelector,
          };

          try {
            newData.avatarSrc = insertAgiAvatar(tinyData[item]);
          } catch (err) {
            console.error(err);
            newData.avatarSrc = defaultAvatar(1);
          }

          customItems.push(newData);
        }
      }
    }

    items.unshift({ name: 'Agents', value: 'agents', custom: customItems });
    const banItem = items.findIndex((item) => item.value === 'ban');
    if (banItem > -1) items.splice(banItem, 1);
  });
}
