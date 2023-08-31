import React from 'react';
import './scss/style.scss';

import buttons, { addRoomOptions } from './menu/Buttons';
import PeopleSelector from './bots/PeopleSelector';
import Welcome from './bots/Welcome';

const serverAddress = 'https://flow.agi.fm/';

export { serverAddress };

export default function startTest(firstTime) {

    // Normal Loading
    if (!firstTime) {

        // Start Mod
        console.log('[agi.fm] Loading mod...');

        // Members List
        tinyAPI.on('roomMembersOptions', (data, items) => {

            items.unshift({
                name: 'Agents', value: 'agents', custom: [
                    {

                        avatarSrc: "https://matrix-server.matrix.horse/_matrix/media/r0/thumbnail/matrix.horse/pcWfVgQCBBJiBTtWAhiwLNUE?width=24&height=24&method=crop",
                        name: "Tiny Jasmini (@jasmindreasond:matrix.horse)",

                        peopleRole: "Bot",
                        powerLevel: undefined,
                        userId: "@jasmindreasond:matrix.horse",
                        username: "jasmindreasond",

                        customClick: () => { console.log('event test'); },
                        customSelector: PeopleSelector,

                    }
                ]
            });

            items.unshift({
                name: 'Agents-Joined', value: 'agents-joined', custom: [

                ]
            });

        });

        // Start Buttons
        buttons();

        // Start Page Detector
        addRoomOptions({}, 'room');
        tinyAPI.on('selectedRoomModeAfter', addRoomOptions);
        tinyAPI.on('selectTabAfter', () => addRoomOptions({}, 'room'));

        // Mod Loaded
        console.log('[agi.fm] Loading complete!');

    }

    // Welcome Page
    tinyAPI.on('startWelcomePage', (data, tinyWelcome) => { tinyWelcome.html = <Welcome />; });

};