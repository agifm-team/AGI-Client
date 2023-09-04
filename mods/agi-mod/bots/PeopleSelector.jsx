import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import defaultAvatar from '../../../src/app/atoms/avatar/defaultAvatar';
import { serverAddress } from '../socket';

function PeopleSelector({ avatarSrc, avatarAnimSrc, name, color, peopleRole, onClick, user, disableStatus }) {
    return <div className="card">
        <div className='text-start my-3 mx-4'><img src={avatarSrc} className="img-fluid avatar rounded-circle" height={100} width={100} alt="avatar" /></div>
        <div className="text-start card-body mt-0 pt-0">
            <h5 className="card-title small text-bg">{name}</h5>
            <p className="card-text very-small text-bg-low">{peopleRole}</p>
        </div>
    </div>
}

PeopleSelector.defaultProps = {
    avatarAnimSrc: null,
    avatarSrc: null,
    peopleRole: null,
    user: null,
    disableStatus: false,
};

PeopleSelector.propTypes = {
    disableStatus: PropTypes.bool,
    user: PropTypes.object,
    avatarAnimSrc: PropTypes.string,
    avatarSrc: PropTypes.string,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    peopleRole: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

let tinyData = null;
function updateAgentsList() {
    return new Promise((resolve) => {
        fetch(`${serverAddress}api/v1/get_bots/user1`, {
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

export { PeopleSelector };
export default function startPeopleSelector() {

    // Members List
    updateAgentsList();
    tinyAPI.on('roomMembersOptions', (data, items) => {

        updateAgentsList();

        if (Array.isArray(tinyData)) {
            for (const item in tinyData) {
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

        items.unshift({
            name: 'Agents-Joined', value: 'agents-joined', custom: [

            ]
        });

    });

};
