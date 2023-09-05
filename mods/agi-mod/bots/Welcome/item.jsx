import React, { useEffect, useRef } from 'react';
import defaultAvatar from '../../../../src/app/atoms/avatar/defaultAvatar';
import { selectRoom, selectRoomMode, selectTab } from '../../../../src/client/action/navigation';
import cons from '../../../../src/client/state/cons';

import * as roomActions from '../../../../src/client/action/room';

import {
    hasDMWith, hasDevices,
} from '../../../../src/util/matrixUtil';

function ItemWelcome({ bot, item, itemsLength }) {

    // Refs
    const buttonRef = useRef(null);

    // Effect
    useEffect(() => {

        // Get Button
        const button = $(buttonRef.current);
        const tinyButton = async () => {

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
                $.LoadingOverlay('show');
                await roomActions.createDM(userId, await hasDevices(userId));
                $.LoadingOverlay('hide');
            } catch (err) {
                console.error(err);
                alert(err.message);
            }

        };

        // Insert Event Click
        button.on('click', tinyButton);
        return () => {
            button.off('click', tinyButton);
        };

    });

    // Complete
    return <li ref={buttonRef} className={`list-group-item border border-bg m${item.index > 0 ? item.index < itemsLength - 1 ? 'x-3' : 's-3' : 'e-3'}`} bot={bot.bot_id}>
        <img className='img-fluid avatar' draggable={false} alt='avatar' src={defaultAvatar(1)} />
        <h5 className="card-title text-bg">{bot.bot_name}</h5>
        <p className="card-text text-bg-low">{bot.description}</p>
    </li>;

}

export default ItemWelcome;
