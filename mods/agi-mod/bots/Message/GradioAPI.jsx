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

                                    const depItem = config.dependencies[item];
                                    const comps = { output: [], input: [], cancel: [] };

                                    // Get Js Values
                                    if (typeof depItem.js === 'string' && depItem.js.length > 0) {
                                        try {

                                            if (depItem.js.startsWith(`() => { window.open(\``) && depItem.js.endsWith(`\`, '_blank') }`)) {
                                                depItem.js = { openUrl: depItem.js.substring(21, depItem.js.length - 14) };
                                            } else {
                                                depItem.js = JSON.parse(depItem.js.trim().replace('() => ', ''));
                                            }

                                        } catch (err) {
                                            console.error(err, depItem.js);
                                            depItem.js = null;
                                        }
                                    } else {
                                        depItem.js = null;
                                    }

                                    // Action Base
                                    const tinyAction = function () {

                                        const tinyTarget = $(this);
                                        console.log(comps);

                                        // Inputs list
                                        for (const index in comps.input) {
                                            console.log('Input Component', comps.input[index].depId, comps.input[index].data);
                                        }

                                        // Outputs list
                                        for (const index in comps.output) {

                                            // Output send result
                                            const output = comps.output[index];
                                            if (
                                                Array.isArray(depItem.js) &&
                                                typeof depItem.js[index] !== 'undefined' &&
                                                output.data.type !== 'column'
                                            ) {
                                                const data = embedData.getComponentValue(output.depId);
                                                data.props.value = depItem.js[index];
                                                embedData.updateHtml(output.depId);
                                            }

                                        }

                                        // Cancel Parts
                                        for (const index in comps.cancel) {
                                            console.log('Cancel Component', comps.cancel[index].depId, comps.cancel[index].data);
                                        }

                                        if (comps.show_progress !== 'hidden') {

                                        }

                                        if (comps.trigger_only_on_success) {

                                        }

                                        if (comps.trigger_after) {

                                        }

                                        if (comps.collects_event_data) {

                                        }

                                    };


                                    // Inputs list
                                    if (Array.isArray(depItem.inputs) && depItem.inputs.length > 0) {
                                        for (const index in depItem.inputs) {
                                            const depId = depItem.inputs[index];
                                            comps.input.push({ depId, data: embedData.getInput(depId) });
                                        }
                                    }


                                    // Outputs list
                                    if (Array.isArray(depItem.outputs) && depItem.outputs.length > 0) {
                                        for (const index in depItem.outputs) {
                                            const depId = depItem.outputs[index];
                                            comps.output.push({ depId, data: embedData.getComponent(depId) });
                                        }
                                    }

                                    // Cancel Parts
                                    if (Array.isArray(depItem.cancels) && depItem.cancels.length > 0) {
                                        for (const index in depItem.cancels) {
                                            const depId = depItem.cancels[index];
                                            comps.cancel.push({ depId, data: embedData.getComponent(depId) });
                                        }
                                    }

                                    comps.show_progress = depItem.show_progress;
                                    comps.trigger_only_on_success = depItem.trigger_only_on_success;
                                    comps.trigger_after = depItem.trigger_after;
                                    comps.collects_event_data = depItem.collects_event_data;

                                    // Target to execute the action
                                    if (Array.isArray(depItem.targets) && depItem.targets.length > 0) {
                                        for (const index in depItem.targets) {

                                            // Get Id
                                            const depId = depItem.targets[index];
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