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
                    console.log(app.config);
                    const page = $('<gradio-embed>', { class: 'text-center', space: id }).append(getHtml(app.config, `gradio-embed[space='${id}']`, agiData.url, id)).data('gladio_app', app);
                    embed.append(page);

                    /*

                        https://www.gradio.app/docs/js-client#submit
                        app.submit('/predict', payload);

                        const dataResult = (data) => {

                            data = { queue: boolean; code?: string; success?: boolean; stage: "pending" | "error" | "complete" | "generating"; size?: number; position?: number; eta?: number; message?: string; progress_data?: Array<{ progress: number | null; index: number | null; length: number | null; unit: string | null; desc: string | null; }>; time?: Date; };

                        };

                        app.on('data', () => {

                        });

                        app.on('status', dataResult);
                        app.off('status', dataResult);

                    */

                    return () => {
                        if (app && typeof app.destroy === 'function') app.destroy();
                        page.remove();
                    };

                }

            }

        }
    });

    // Temp result. (I'm using this only to have a preview. This will be removed later.)
    return <div ref={embedRef} className='mt-2 agi-client-embed border border-bg p-4'>
        <iframe title='gradio' src={agiData.url} />
    </div>;

};

export default GradioEmbed;