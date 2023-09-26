import React, { useRef, useEffect, useState } from 'react';
import { client } from '@gradio/client';
import GradioLayout from './gradioLayout';
import { objType, toast } from '../../../../src/util/tools';

function GradioEmbed({ agiData }) {

    // Prepare Data
    const embedRef = useRef(null);
    const [app, setApp] = useState(null);
    const [appError, setAppError] = useState(null);

    useEffect(() => {
        if (!appError) {
            try {

                // Error
                const tinyError = (err) => {
                    console.error(err);
                    toast(err.message);
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

                        // Submit
                        const tinySubmit = (apiName = '', inputs = []) => {

                            // https://www.gradio.app/docs/js-client#submit
                            const job = app.submit(apiName, inputs);

                            /*
    
                            api_name ==> named_endpoints
                            api_name null (use the dependencies index) ==> unnamed_endpoints
    
                            inputs ==> parameters
                            returns ==> outputs
    
                            target ==> button
    
                            */

                            // Sockets
                            job.on('data', (data) => {
                                console.log(data);
                            });

                            job.on('status', (data) => {

                                console.log(data);
                                // data = { queue: boolean; code?: string; success?: boolean; stage: "pending" | "error" | "complete" | "generating"; size?: number; position?: number; eta?: number; message?: string; progress_data?: Array < { progress: number | null; index: number | null; length: number | null; unit: string | null; desc: string | null; } >; time?: Date; };

                            });

                            // Complete
                            return job;

                        };

                        console.log(id);

                        // Read dependencies
                        if (Array.isArray(config.dependencies) && config.dependencies.length > 0) {
                            for (const item in config.dependencies) {

                                if (typeof config.dependencies[item].trigger === 'string') {

                                    // Get Js Values
                                    if (typeof config.dependencies[item].js === 'string' && config.dependencies[item].js.length > 0) {
                                        try {

                                            if (config.dependencies[item].js.startsWith(`() => { window.open(\``) && config.dependencies[item].js.endsWith(`\`, '_blank') }`)) {
                                                config.dependencies[item].js = { openUrl: config.dependencies[item].js.substring(21, config.dependencies[item].js.length - 14) };
                                            } else {
                                                config.dependencies[item].js = JSON.parse(config.dependencies[item].js.trim().replace('() => ', ''));
                                            }

                                        } catch (err) {
                                            console.error(err, config.dependencies[item].js);
                                            config.dependencies[item].js = null;
                                        }
                                    } else {
                                        config.dependencies[item].js = null;
                                    }

                                    // Action Base
                                    const tinyAction = function () {

                                        const tinyTarget = $(this);
                                        console.log(tinyTarget);

                                        // Inputs list
                                        if (Array.isArray(config.dependencies[item].inputs) && config.dependencies[item].inputs.length > 0) {
                                            for (const index in config.dependencies[item].inputs) {

                                                const depId = config.dependencies[item].inputs[index];
                                                const input = embedData.getInput(depId);

                                                console.log('Input Component', depId, input);

                                            }
                                        }


                                        // Outputs list
                                        if (Array.isArray(config.dependencies[item].outputs) && config.dependencies[item].outputs.length > 0) {
                                            for (const index in config.dependencies[item].outputs) {

                                                const depId = config.dependencies[item].outputs[index];
                                                const output = embedData.getComponent(depId);

                                                console.log('Output', depId, output);

                                            }
                                        }

                                        // Cancel Parts
                                        if (Array.isArray(config.dependencies[item].cancels) && config.dependencies[item].cancels.length > 0) {
                                            for (const index in config.dependencies[item].cancels) {

                                                const depId = config.dependencies[item].cancels[index];
                                                const cancel = embedData.getComponent(depId);

                                                console.log('Cancel', depId, cancel);

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

                                        // embedData.updateHtml();
                                        // embedData.getComponentValue();

                                    };

                                    // Target to execute the action
                                    if (Array.isArray(config.dependencies[item].targets) && config.dependencies[item].targets.length > 0) {
                                        for (const index in config.dependencies[item].targets) {

                                            // Get Id
                                            const depId = config.dependencies[item].targets[index];
                                            const target = embedData.getTarget(depId);
                                            if (target) {

                                                // jQuery
                                                if (target.type === 'jquery') {
                                                    target.value.on('click', tinyAction);
                                                }

                                                // Array
                                                else if (target.type === 'array') {
                                                    for (const item2 in target.value) {

                                                        // Mode 1
                                                        if (!Array.isArray(target.value[item2])) {
                                                            target.value[item2].on('click', tinyAction);
                                                        }

                                                        // Mode 2
                                                        else {
                                                            for (const item3 in target.value[item2]) {
                                                                target.value[item2][item3].on('click', tinyAction);
                                                            }
                                                        }

                                                    }
                                                }

                                                // Target
                                                console.log('Target', depId, target);

                                            }

                                        }
                                    }

                                }

                            }
                        }

                        console.log(config);
                        return () => {
                            if (app && typeof app.destroy === 'function') app.destroy();
                            page.remove();
                        };

                    }

                }

            } catch (err) {
                console.error(err);
                toast(err.message);
            }
        }
    });

    // Temp result. (I'm using this only to have a preview. This will be removed later.)
    return <div ref={embedRef} className='mt-2 agi-client-embed border border-bg p-4'>
        <iframe title='gradio' src={agiData.url} />
    </div>;

};

export default GradioEmbed;