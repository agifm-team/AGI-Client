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

updateAgentsList();
const customItems = { public: [], personal: [] };
export default function startPeopleSelector() {
  // Members List
  updateAgentsList();
  tinyAPI.on('roomMembersOptions', (data, items) => {
    updateAgentsList();

    customItems.public = [];
    customItems.personal = [];
    const addCustomItems = (theTinyData, where) => {
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

            customItems[where].push(newData);
          }
        }
      }
    };

    if (objType(tinyData, 'object')) {
      customItems.personal.push({
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
      addCustomItems(tinyData.personal, 'personal');

      customItems.public.push({
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
      addCustomItems(tinyData.public, 'public');
    }

    items.unshift({ name: 'Personal', value: 'personal', custom: customItems.personal });
    items.unshift({ name: 'Public', value: 'agents', custom: customItems.public });

    const banItem = items.findIndex((item) => item.value === 'ban');
    if (banItem > -1) items.splice(banItem, 1);

    const invitedItem = items.findIndex((item) => item.value === 'invite');
    if (invitedItem > -1) items.splice(invitedItem, 1);
  });
}
