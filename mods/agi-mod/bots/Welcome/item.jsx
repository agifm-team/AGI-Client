import React, { useEffect, useRef } from 'react';
import defaultAvatar from '../../../../src/app/atoms/avatar/defaultAvatar';

function ItemWelcome({ bot, item, itemsLength }) {

    const buttonRef = useRef(null);

    useEffect(() => {

        const button = $(buttonRef.current);
        const tinyButton = (e) => {
            const botId = button.attr('bot');
            console.log(botId);
        };

        button.on('click', tinyButton);
        return () => {
            button.off('click', tinyButton);
        };

    });

    return <li ref={buttonRef} className={`list-group-item border border-bg m${item.index > 0 ? item.index < itemsLength - 1 ? 'x-3' : 's-3' : 'e-3'}`} bot={bot.bot_id}>
        <img className='img-fluid avatar' draggable={false} alt='avatar' src={defaultAvatar(1)} />
        <h5 className="card-title text-bg">{bot.bot_name}</h5>
        <p className="card-text text-bg-low">{bot.description}</p>
    </li>;

}

export default ItemWelcome;
