import React from 'react';
import './scss/style.scss';
import startPeopleSelector from './bots/PeopleSelector';

import buttons, { addRoomOptions } from './menu/Buttons';
import Welcome from './bots/Welcome';

export default function startTest(firstTime) {

    // Normal Loading
    if (!firstTime) {

        // Start Mod
        console.log('[agi.fm] Loading mod...');

        // Start Buttons
        startPeopleSelector();
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