import React, { useRef, useEffect, useState } from 'react';
import { client } from '@gradio/client';
import GradioLayout from './gradioLayout';
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
                    const config = app.config;

                    // Read Template
                    const embedData = new GradioLayout(config, `gradio-embed[space='${id}']`, agiData.url, id);
                    const page = $('<gradio-embed>', { class: 'text-center', space: id });
                    embedData.insertHtml(page);
                    embed.append(page);

                    // Read dependencies
                    if (Array.isArray(config.dependencies) && config.dependencies.length > 0) {
                        for (const item in config.dependencies) {

                            if (typeof config.dependencies[item].trigger === 'string') {

                                // Get Js Values
                                if (typeof config.dependencies[item].js === 'string') {
                                    try {

                                        if (config.dependencies[item].js.startsWith(`() => { window.open(\``).endsWith(`\`, '_blank') }`)) {
                                            config.dependencies[item].js = { openUrl: config.dependencies[item].js.substring(21, config.dependencies[item].js.length - 14) };
                                        } else {
                                            config.dependencies[item].js = JSON.parse(config.dependencies[item].js.trim().replace('() => ', ''));
                                        }

                                    } catch (err) {
                                        console.error(err, config.dependencies[item].js);
                                        config.dependencies[item].js = null;
                                    }
                                }

                                // Cancel Parts
                                if (Array.isArray(config.dependencies[item].cancels) && config.dependencies[item].cancels.length > 0) {
                                    for (const index in config.dependencies[item].cancels) {

                                    }
                                }

                                // Inputs list
                                if (Array.isArray(config.dependencies[item].inputs) && config.dependencies[item].inputs.length > 0) {
                                    for (const index in config.dependencies[item].inputs) {

                                    }
                                }

                                // Outputs list
                                if (Array.isArray(config.dependencies[item].outputs) && config.dependencies[item].outputs.length > 0) {
                                    for (const index in config.dependencies[item].outputs) {

                                    }
                                }

                                // Target to execute the action
                                if (Array.isArray(config.dependencies[item].targets) && config.dependencies[item].targets.length > 0) {
                                    for (const index in config.dependencies[item].targets) {

                                        // console.log(embedData.getComponent(config.dependencies[item].targets[index]));
                                        // html.data('gradio_update')();
                                        // html.data('gradio_values');

                                    }
                                }

                                if (config.dependencies[item].show_progress !== 'hidden') {

                                }

                                if (config.dependencies[item].trigger_only_on_success) {

                                }

                                if (config.dependencies[item].trigger_after) {

                                }

                                if (config.dependencies[item].collects_event_data) {

                                }

                            }

                        }
                    }

                    console.log(config, page);

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