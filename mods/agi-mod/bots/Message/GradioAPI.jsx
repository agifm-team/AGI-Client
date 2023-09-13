import React, { useRef, useEffect, useState } from 'react';
import { client } from '@gradio/client';
import { getHtml } from './gradioLayout';
import { objType } from '../../../../src/util/tools';

function GradioEmbed({ agiData }) {

    // Prepare Data
    const embedRef = useRef(null);
    const [app, setApp] = useState(null);
    const [appError, setAppError] = useState(null);

    useEffect(() => {
        if (!appError) {

            // Error
            const tinyError = (err) => {
                console.error(err);
                setAppError(err);
            };

            // Load App
            if (!app) {
                client(agiData.url).then(newApp => setApp(newApp)).catch(tinyError);
            }

            // Execute Data
            else {

                // Insert Embed
                const embed = $(embedRef.current);
                if (embed.find('gladio-embed').length < 1 && objType(app, 'object') && objType(app.config, 'object') && typeof app.config.space_id === 'string' && app.config.space_id.length > 0) {

                    // Id
                    const id = app.config.space_id.replace('/', '_');

                    // Read Template
                    const page = $('<gradio-embed>', { class: 'text-center', space: id }).append(getHtml(app.config, `gradio-embed[space='${id}']`, agiData.url)).data('gladio_app', app);
                    embed.append(page);

                    return () => {
                        page.remove();
                    };

                }

            }

        }
    });

    // Temp result. (I'm using this only to have a preview. This will be removed later.)
    return <div ref={embedRef} className='mt-2 agi-client-embed border border-bg p-4 bg-bg2'>
        <iframe title='gradio' src={agiData.url} />
    </div>;

};

export default GradioEmbed;