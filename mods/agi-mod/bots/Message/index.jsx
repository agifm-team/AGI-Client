import React from 'react';
import GradioEmbed from './GradioAPI';
import tinyAPI from '../../../../src/util/mods';

export default function startMessage() {
    tinyAPI.on('messageBody', (data, content, msgInfo) => {
        if (content['agi.client.iframe.item']) {

            // Get Data
            const agiData = content['agi.client.iframe.item'];

            // Embed
            if (agiData.type === 'iframe') {

                // Gradio
                if (agiData.source === 'gradio') {
                    data.custom = <GradioEmbed msgInfo={msgInfo} agiData={agiData} />;
                }

            }

        }
    });
};