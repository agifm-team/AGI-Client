import defaultAvatar from '../../../../src/app/atoms/avatar/defaultAvatar';
import { serverAddress } from '../../socket';
import PeopleSelector from './Item';
import tinyAPI from '../../../../src/util/mods';
import initMatrix from '../../../../src/client/initMatrix';

let tinyData = null;
function updateAgentsList() {
    return new Promise((resolve) => {
        fetch(`${serverAddress}list/${initMatrix.matrixClient.getUserId()}`, {
            headers: {
                'Accept': 'application/json'
            }
        }).then(res => res.json()).then((newData) => {
            tinyData = newData;
            resolve();
        }).catch(err => {
            console.error(err);
            alert(err.message);
            resolve();
        });
    });
};

export default function startPeopleSelector() {

    // Members List
    updateAgentsList();
    tinyAPI.on('roomMembersOptions', (data, items) => {

        updateAgentsList();

        if (Array.isArray(tinyData)) {
            for (const item in tinyData) {
                if (typeof tinyData[item] === 'string') {
                    items.unshift({
                        name: 'Agents', value: 'agents', custom: [
                            {

                                avatarSrc: defaultAvatar(1),
                                name: tinyData[item],

                                peopleRole: "Bot",
                                powerLevel: undefined,
                                userId: tinyData[item],
                                username: tinyData[item],

                                customClick: () => { console.log('event test'); },
                                customSelector: PeopleSelector,

                            }
                        ]
                    });
                }
            }
        }

        items.push({
            name: 'Agents', value: 'agents-joined', custom: [

            ]
        });

        const banItem = items.findIndex(item => item.value === 'ban');
        if (banItem > -1) items.splice(banItem, 1);

        console.log(items);
    });

};
