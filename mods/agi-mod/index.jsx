import React from 'react';
import './scss/style.scss';
import startPeopleSelector from './bots/PeopleSelector';

import buttons, { addRoomOptions } from './menu/Buttons';
import Welcome from './bots/Welcome';
import startMessage from './bots/Message';

export default function startAgiMod(firstTime) {

    // Normal Loading
    if (!firstTime) {

        // Start Mod
        console.log('[immagine.ai] Loading mod...');

        // Start Buttons
        startPeopleSelector();
        buttons();
        startMessage();

        // Start Page Detector
        addRoomOptions({}, 'room');
        tinyAPI.on('selectedRoomModeAfter', addRoomOptions);
        tinyAPI.on('selectTabAfter', () => addRoomOptions({}, 'room'));

        // Mod Loaded
        console.log('[immagine.ai] Loading complete!');

    }

    // Welcome Page
    tinyAPI.on('startWelcomePage', (data, tinyWelcome) => { tinyWelcome.html = <Welcome />; });

};