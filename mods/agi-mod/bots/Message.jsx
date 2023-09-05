import React from 'react';

export default function startMessage() {
    tinyAPI.on('messageBody', (data, content) => {
        if (content['agi.client.iframe.item']) {

            // Get Data
            const agiData = content['agi.client.iframe.item'];
            console.log(content);

            // Embed
            if (agiData.type === 'iframe') {

                // Gradio
                if (agiData.source === 'gradio') {
                    data.custom = <div className='mt-2 ratio ratio-16x9 embed-video enabled agi-client-embed'>
                        <embed title='Agi-Client' src={agiData.url} />
                    </div>;
                }

            }

        }
    });
};