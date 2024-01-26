import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// import { selectRoom, selectRoomMode, selectTab } from '../../../../src/client/action/navigation';
// import cons from '../../../../src/client/state/cons';

import * as roomActions from '../../../../src/client/action/room';

/* import {
    hasDMWith, hasDevices,
} from '../../../../src/util/matrixUtil'; */

import { setLoadingPage } from '../../../../src/app/templates/client/Loading';
import { getRoomInfo } from '../../../../src/app/organisms/room/Room';

function PeopleSelector({ avatarSrc, name, user, peopleRole, }) {

    // Refs
    const buttonRef = useRef(null);

    // Effect
    useEffect(() => {

        // Get Button
        const button = $(buttonRef.current);
        const tinyButton = async (event) => {

            const userId = $(event.currentTarget).attr('bot');
            if (typeof userId === 'string') {

                const roomId = getRoomInfo().roomTimeline.room.roomId;

                setLoadingPage();
                roomActions.invite(roomId, userId.startsWith('@') ? userId : `@${userId}`).then(() => setLoadingPage(false)).catch(err => {
                    setLoadingPage(false);
                    console.error(err);
                    alert(err.message);
                });

            }

            /*

            // Select tab and bot id
            selectTab(cons.tabs.DIRECTS);
            const userId = button.attr('bot');

            // Check and open if user already have a DM with userId.
            const dmRoomId = hasDMWith(userId);
            if (dmRoomId) {
                selectRoomMode('room');
                selectRoom(dmRoomId);
                return;
            }

            // Create new DM
            try {
                setLoadingPage();
                await roomActions.createDM(userId, await hasDevices(userId));
                setLoadingPage(false);
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
            */

        };

        // Insert Event Click
        button.on('click', tinyButton);
        return () => {
            button.off('click', tinyButton);
        };

    });

    return <div ref={buttonRef} bot={user?.userId || name} className="card agent-button noselect">
        <div className='text-start my-3 mx-4'><img src={avatarSrc} className="img-fluid avatar rounded-circle" draggable={false} height={100} width={100} alt="avatar" /></div>
        <div className="text-start card-body mt-0 pt-0">
            <h5 className="card-title small text-bg">{name}</h5>
            <p className="card-text very-small text-bg-low">{peopleRole}</p>
        </div>
    </div>;

}

PeopleSelector.defaultProps = {
    avatarSrc: null,
    peopleRole: null,
};

PeopleSelector.propTypes = {
    avatarSrc: PropTypes.string,
    name: PropTypes.string.isRequired,
    peopleRole: PropTypes.string,
};

export default PeopleSelector;