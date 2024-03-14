import defaultAvatar from '@src/app/atoms/avatar/defaultAvatar';

import { insertAgiAvatar } from '@mods/agi-mod/lib';
import tinyAPI from '@src/util/mods';
import initMatrix from '@src/client/initMatrix';
import { objType } from '@src/util/tools';

import { serverAddress } from '../../socket';
import PeopleSelector from './Item';

let tinyData = null;
export function updateAgentsList() {
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
    const addCustomItems = (theTinyData) => {
      if (Array.isArray(theTinyData)) {
        for (const item in theTinyData) {
          if (objType(theTinyData[item], 'object')) {
            const newData = {
              // name: theTinyData[item].agent_name,
              name: theTinyData[item].bot_username,

              peopleRole: 'Bot',
              powerLevel: undefined,
              customData: theTinyData[item].customData,
              userId: theTinyData[item].bot_username,
              username: theTinyData[item].bot_username,

              customClick: (event) => {
                event.preventDefault();
              },
              customSelector: PeopleSelector,
            };

            try {
              newData.avatarSrc = insertAgiAvatar(theTinyData[item]);
            } catch (err) {
              console.error(err);
              newData.avatarSrc = defaultAvatar(1);
            }

            customItems.push(newData);
          }
        }
      }
    };

    if (objType(tinyData, 'object')) {
      customItems.push({
        name: 'My Agents',
        peopleRole: 'divisor',
        powerLevel: undefined,
        userId: '',
        username: '',
        customClick: (event) => {
          event.preventDefault();
        },
        customSelector: PeopleSelector,
      });
      addCustomItems(tinyData.personal);

      customItems.push({
        name: 'Public Agents',
        peopleRole: 'divisor',
        powerLevel: undefined,
        userId: '',
        username: '',
        customClick: (event) => {
          event.preventDefault();
        },
        customSelector: PeopleSelector,
      });
      addCustomItems(tinyData.public);
    }

    items.unshift({ name: 'Agents', value: 'agents', custom: customItems });
    const banItem = items.findIndex((item) => item.value === 'ban');
    if (banItem > -1) items.splice(banItem, 1);
  });
}
