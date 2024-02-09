import defaultAvatar from '@src/app/atoms/avatar/defaultAvatar';

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

export default function startPeopleSelector() {
  // Members List
  updateAgentsList();
  tinyAPI.on('roomMembersOptions', (data, items) => {
    updateAgentsList();

    const customItems = [];
    if (Array.isArray(tinyData)) {
      for (const item in tinyData) {
        if (objType(tinyData[item], 'object')) {
          customItems.push({
            avatarSrc: defaultAvatar(1),
            // name: tinyData[item].agent_name,
            name: tinyData[item].bot_username,

            peopleRole: 'Bot',
            powerLevel: undefined,
            userId: tinyData[item].bot_username,
            username: tinyData[item].bot_username,

            customClick: (event) => {
              event.preventDefault();
            },
            customSelector: PeopleSelector,
          });
        }
      }
    }

    items.unshift({ name: 'Agents', value: 'agents', custom: customItems });
    const banItem = items.findIndex((item) => item.value === 'ban');
    if (banItem > -1) items.splice(banItem, 1);
  });
}
