import React, { useEffect, useRef } from 'react';
import defaultAvatar from '../../../../src/app/atoms/avatar/defaultAvatar';
import { selectRoom, selectRoomMode, selectTab } from '../../../../src/client/action/navigation';
import cons from '../../../../src/client/state/cons';

import * as roomActions from '../../../../src/client/action/room';

import {
    hasDMWith, hasDevices,
} from '../../../../src/util/matrixUtil';
import { setLoadingPage } from '../../../../src/app/templates/client/Loading';
import initMatrix from '../../../../src/client/initMatrix';
import { join } from '../../../../src/client/action/room';

const openRoom = (roomId) => {

    const mx = initMatrix.matrixClient;
    const room = mx.getRoom(roomId);

    if (!room) return;
    if (room.isSpaceRoom()) selectTab(roomId);

    else {
        selectRoomMode('room');
        selectRoom(roomId);
    }

};

// Models
const valuesLoad = {

    // Bots
    bots: {

        // Tab
        tab: cons.tabs.DIRECTS,

        // Data Button
        getRoom: async (userId) => {

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

        },

    },

    // Rooms
    rooms: {

        // Tab
        tab: cons.tabs.HOME,

        // Data Button
        getRoom: async (alias) => {

            const mx = initMatrix.matrixClient;
            setLoadingPage('Looking for address...');
            let via;
            if (alias.startsWith('#')) {
                try {
                    const aliasData = await mx.getRoomIdForAlias(alias);
                    via = aliasData?.servers.slice(0, 3) || [];
                    setLoadingPage(`Joining ${alias}...`);
                } catch (err) {
                    setLoadingPage(false);
                    console.error(err);
                    alert(`Unable to find room/space with ${alias}. Either room/space is private or doesn't exist.`);
                }
            }
            try {
                const roomId = await join(alias, false, via);
                openRoom(roomId);
                setLoadingPage(false);
            } catch {
                setLoadingPage(false);
                alert(`Unable to join ${alias}. Either room/space is private or doesn't exist.`);
            }

        },

    },

};

function ItemWelcome({ bot, type, index, itemsLength, isGuest }) {

    // Refs
    const buttonRef = useRef(null);

    // Effect
    useEffect(() => {
        if (valuesLoad[type] && typeof valuesLoad[type].tab === 'string' && typeof valuesLoad[type].getRoom === 'function') {

            // Get Button
            const button = $(buttonRef.current);
            const tinyButton = () => {

                if (!isGuest) {

                    // Select tab and bot id
                    selectTab(valuesLoad[type].tab);
                    return valuesLoad[type].getRoom(button.attr('bot'));

                }

                alert('To make this action, you need to log in.');

            };

            // Insert Event Click
            button.on('click', tinyButton);
            return () => {
                button.off('click', tinyButton);
            };

        }
    });

    const avatar = defaultAvatar(1);

    // Complete
    return <div
        ref={buttonRef}
        className={`citem col-md-1 my-2 border border-bg m${index > 0 ? index < itemsLength - 1 ? 'x-3' : 's-3' : 'e-3'}${isGuest ? ' guest-mode' : ''}`} bot={typeof bot.id === 'string' && bot.id !== 'Coming soon!' ? bot.id : null}
    >
        <img className='img-fluid avatar avatar-bg' draggable={false} alt='avatar' src={avatar} />
        <img className='img-fluid avatar' draggable={false} alt='avatar' src={avatar} />
        {typeof bot.title === 'string' ? <h6 className="card-title text-bg">{bot.title}</h6> : null}
        <p className="card-text text-bg-low">{bot.description.length < 100 ? bot.description :
            <>
                <div className='card-normal-text'>{`${bot.description.substring(0, 100)}...`}</div>
                <div className='card-normal-text-hover'>{bot.description}</div>
            </>
        }</p>
    </div>;

}

export default ItemWelcome;
