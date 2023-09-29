import React, { useRef, useEffect, useState } from 'react';
import { client } from '@gradio/client';
import GradioLayout, { fileUrlGenerator } from './gradioLayout';
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
                        const embedCache = {};
                        const id = app.config.space_id.replace('/', '_');
                        const config = app.config;

                        // Read Template
                        const embedData = new GradioLayout(config, `gradio-embed[space='${id}']`, agiData.url, id, embedCache);
                        const page = $('<gradio-embed>', { class: 'text-center', space: id });
                        embedData.insertHtml(page);
                        embed.append(page);

                        // Send Update
                        const sendTinyUpdate = (index, output, value) => {

                            // Output send result
                            if (
                                objType(output, 'object') &&
                                objType(output.data, 'object') &&
                                typeof value !== 'undefined' &&
                                (value || value === null)
                            ) {

                                const data = embedData.getComponentValue(output.depId);
                                const input = embedData.getInput(output.depId);
                                if (objType(input, 'object')) {

                                    data.props.value = value;
                                    if (input.type === 'jquery') {
                                        input.value.val(value);
                                    }

                                    if (input.type === 'blob') {
                                        input.value(value);
                                    }

                                }

                            }

                        };

                        // Submit
                        const tinySubmit = (comps, tinyIndex) => {

                            // Input Values
                            const inputs = [];

                            // Read data
                            for (const index in comps.input) {

                                // jQuery
                                if (comps.input[index].data.type === 'jquery') {
                                    try {

                                        const value = comps.input[index].data.value.val();
                                        if (typeof value === 'string' && value.length > 0) {
                                            inputs.push(value);
                                        } else {
                                            inputs.push(null);
                                        }

                                    } catch (err) {
                                        console.error(err);
                                        inputs.push(null);
                                    }
                                }

                                // Blob
                                else if (comps.input[index].data.type === 'blob') {
                                    try {

                                        if (typeof comps.input[index].data.value === 'function') {
                                            inputs.push(comps.input[index].data.value());
                                        } else {
                                            inputs.push(null);
                                        }

                                    } catch (err) {
                                        console.error(err);
                                        inputs.push(null);
                                    }
                                }

                                // Others
                                else {
                                    console.log('Input Component', comps.input[index].depId, comps.input[index].data);
                                }

                            }

                            // https://www.gradio.app/docs/js-client#submit
                            const submitName = comps.api_name ? `/${comps.api_name}` : Number(tinyIndex);

                            let status = 'starting';
                            $.LoadingOverlay('show', { text: 'Starting gradio...' });
                            const job = app.submit(submitName, inputs);

                            // Sockets
                            job.on('data', (data) => {

                                // Convert to momentjs
                                data.time = moment(data.time);

                                // Data
                                if (Array.isArray(data.data) && data.data.length > 0) {
                                    for (const item in data.data) {
                                        for (const index in data.data[item]) {

                                            const tinyData = data.data[item][index];
                                            const value = objType(tinyData, 'object') && typeof tinyData.name === 'string' && tinyData.is_file ? `${fileUrlGenerator(agiData.url)}${tinyData.name}` : null;

                                            sendTinyUpdate(
                                                tinyIndex,
                                                comps.output[index],
                                                value
                                            );

                                        }
                                    }
                                }

                            });

                            job.on('status', (data) => {

                                // Convert to momentjs
                                data.time = moment(data.time);
                                const loadPage = $('.loadingoverlay .loadingoverlay_text');

                                // Queue
                                if (data.queue) {

                                }

                                // Pending
                                if (data.stage === 'pending' && status !== 'pending') {
                                    status = 'pending';
                                    loadPage.text('Pending...');
                                }

                                // Complete
                                else if (data.stage === 'complete' && status !== 'complete') {

                                    // Success?
                                    status = 'complete';
                                    $.LoadingOverlay('hide');
                                    if (data.success) {

                                    }

                                }

                                // Error
                                else if (data.stage === 'error' && status !== 'error') {
                                    status = 'error';
                                    $.LoadingOverlay('hide');
                                    toast(data.message);
                                    console.error(data.message, data.code);
                                }

                                // Generating
                                else if (data.stage === 'generating' && status !== 'generating') {
                                    status = 'generating';
                                    loadPage.text('Generating...');
                                }

                            });

                        };

                        console.log(id);

                        embedCache.genDeps = (item) => {

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

                                // Outputs list
                                for (const index in comps.output) {
                                    sendTinyUpdate(
                                        item,
                                        comps.output[index],
                                        Array.isArray(depItem.js) && typeof depItem.js[index] !== 'undefined' ? depItem.js[index] : null
                                    );
                                }

                                // Cancel Parts
                                for (const index in comps.cancel) {
                                    console.log('Cancel Component', comps.cancel[index].depId, comps.cancel[index].data);
                                }

                                if (comps.scroll_to_output) {

                                }

                                if (comps.show_progress !== 'hidden') {

                                }

                                if (comps.trigger_only_on_success) {

                                }

                                if (comps.trigger_after) {

                                }

                                if (comps.collects_event_data) {

                                }

                                // Inputs list
                                if (comps.backend_fn) tinySubmit(comps, item);

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
                            comps.backend_fn = depItem.backend_fn;

                            const clickAction = (target) => {

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

                            };

                            // Trigger
                            const trigger = config.dependencies[item].trigger;

                            // Target to execute the action
                            if (Array.isArray(depItem.targets) && depItem.targets.length > 0) {
                                for (const index in depItem.targets) {

                                    // String
                                    if (typeof trigger === 'string') {

                                        // Get Id
                                        const depId = depItem.targets[index];
                                        const target = embedData.getTarget(depId);
                                        if (target) {

                                            // Target
                                            clickAction(target);

                                        }

                                    }

                                    // Array
                                    else if (Array.isArray(depItem.targets[index]) && depItem.targets[index].length > 0) {
                                        if (typeof depItem.targets[index][0] === 'number' && typeof depItem.targets[index][1] === 'string' && depItem.targets[index][1] === 'click') {

                                            // Get Id
                                            const depId = depItem.targets[index][0];
                                            const target = embedData.getTarget(depId);
                                            if (target) {

                                                // Target
                                                clickAction(target);
                                                console.log('Target', depId, target);

                                            }

                                        }
                                    }

                                }
                            }

                        };

                        // Read dependencies
                        if (Array.isArray(config.dependencies) && config.dependencies.length > 0) {
                            for (const item in config.dependencies) {
                                embedCache.genDeps(item);
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
    // <iframe title='gradio' src={agiData.url} />
    return <div ref={embedRef} className='mt-2 agi-client-embed border border-bg p-4' />;

};

export default GradioEmbed;