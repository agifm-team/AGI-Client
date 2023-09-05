import React from 'react';

export default function Message(data, content) {

    if (content['agi.client.iframe.item']) {
        data.custom = <div>Tiny Test</div>;
    }

};