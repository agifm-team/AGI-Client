import defaultAvatar from '../../../../src/app/atoms/avatar/defaultAvatar';
import { serverAddress } from '../../socket';
import PeopleSelector from './Item';
import tinyAPI from '../../../../src/util/mods';

let tinyData = null;
function updateAgentsList() {
    return new Promise((resolve) => {
        fetch(`${serverAddress}api/v1/get_bots/user15`, {
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

        /* items.unshift({
            name: 'Agents-Joined', value: 'agents-joined', custom: [

            ]
        }); */

    });

};
