import React from 'react';

export default function startMessage() {
    tinyAPI.on('messageBody', (data, content) => {

        if (content['agi.client.iframe.item']) {
            console.log(content);
            data.custom = <div>Tiny Test</div>;
        }

    });
};