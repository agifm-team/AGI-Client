import React from 'react';
import GradioEmbed from './GradioAPI';

export default function startMessage() {
    tinyAPI.on('messageBody', (data, content) => {
        if (content['agi.client.iframe.item']) {

            // Get Data
            const agiData = content['agi.client.iframe.item'];

            // Embed
            if (agiData.type === 'iframe') {

                // Gradio
                if (agiData.source === 'gradio') {
                    data.custom = <GradioEmbed agiData={agiData} />;
                }

            }

        }
    });
};