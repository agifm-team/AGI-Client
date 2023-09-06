import React from 'react';
import './scss/style.scss';
import startPeopleSelector from './bots/PeopleSelector';

import buttons, { addRoomOptions } from './menu/Buttons';
import Welcome from './bots/Welcome';
import startMessage from './bots/Message';

if ($('head').find('#gradio-api').length < 1) {
    $('head').append($('<script>', { src: 'https://gradio.s3-us-west-2.amazonaws.com/3.42.0/gradio.js', id: 'gradio-api', type: 'module' }))
}

export default function startAgiMod(firstTime) {

    // Normal Loading
    if (!firstTime) {

        // Start Mod
        console.log('[agi.fm] Loading mod...');

        // Start Buttons
        startPeopleSelector();
        buttons();
        startMessage();

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