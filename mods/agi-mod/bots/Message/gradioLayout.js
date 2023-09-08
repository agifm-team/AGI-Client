import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';

import { objType, toast } from '../../../../src/util/tools';
import { copyToClipboard } from '../../../../src/util/common';

const labelCreator = (props) => {

};

const displayOptions = (props) => $('<div>', { class: `${!props.visible ? 'd-none ' : ''}my-2` }).data('gradio_props', props);

// Components
const components = {

    audio: (props) => {
        console.log(`Audio`, props);
    },

    barplot: (props) => {
        console.log(`BarPlot`, props);
    },

    button: (props) => $('<button>', {
        id: props.elem_id ? `gradio_${props.elem_id}` : null,
        class: `${!props.visible ? 'd-none ' : ''}btn btn-${props.variant ? props.variant : 'bg'}`
    }).data('gradio_props', props).text(props.value),

    chatbot: (props) => {
        console.log(`Chatbot`, props);
    },

    checkbox: (props) => {
        console.log(`Checkbox`, props);
    },

    checkboxgroup: (props) => {
        console.log(`CheckboxGroup`, props);
    },

    clearbutton: (props) => {
        console.log(`ClearButton`, props);
    },

    code: (props) => {
        console.log(`Code`, props);
    },

    colorpicker: (props) => {
        console.log(`ColorPicker`, props);
    },

    dataframe: (props) => {
        console.log(`Dataframe`, props);
    },

    dataset: (props) => {
        console.log(`Dataset`, props);
    },

    dropdown: (props) => {

        const finalResult = displayOptions(props);
        const id = props.elem_id ? `gradio_${props.elem_id}` : null;

        if (props.show_label && props.label && id !== null) {
            finalResult.append($('<label>', { for: id, class: 'form-label' }).text(props.label));
        }

        const dropdown = $(`<select>`, {
            id: id !== null ? id : null,
            class: 'form-control form-control-bg'
        });

        if (Array.isArray(props.choices) && props.choices.length > 0) {

            for (const item in props.choices) {
                if (typeof props.choices[item] === 'string') {
                    dropdown.append($('<option>', { value: props.choices[item] }).text(props.choices[item]));
                }
            }

            if (props.allow_custom_value) {
                dropdown.append($('<option>', { value: 'custom' }).text('Custom'));
            }

            dropdown.val(props.value);

            if (props.allow_custom_value) {
                dropdown.append($('<input>', { type: 'text', value: props.value, readonly: (props.choices.indexOf(props.value) > -1) }));
            }

            finalResult.append(dropdown);

        }

        return finalResult;

    },

    duplicatebutton: (props) => {
        console.log(`DuplicateButton`, props);
    },

    file: (props) => {
        console.log(`File`, props);
    },

    gallery: (props) => {
        console.log(`Gallery`, props);
    },

    html: (props) => $(props.value).data('gradio_props', props),

    highlightedtext: (props) => {
        console.log(`HighlightedText`, props);
    },

    image: (props) => {
        console.log(`Image`, props);
    },

    interpretation: (props) => {
        console.log(`Interpretation`, props);
    },

    json: (props) => {
        console.log(`JSON`, props);
    },

    label: (props) => {
        console.log(`Label`, props);
    },

    lineplot: (props) => {
        console.log(`LinePlot`, props);
    },

    loginbutton: (props) => {
        console.log(`LoginButton`, props);
    },

    logoutbutton: (props) => {
        console.log(`LogoutButton`, props);
    },

    markdown: (props) => $(sanitizeHtml(marked.parse(props.value))).data('gradio_props', props),

    model3d: (props) => {
        console.log(`Model3D`, props);
    },

    number: (props) => {
        console.log(`Number`, props);
    },

    plot: (props) => {
        console.log(`Plot`, props);
    },

    radio: (props) => {
        console.log(`Radio`, props);
    },

    scatterplot: (props) => {
        console.log(`ScatterPlot`, props);
    },

    slider: (props) => {
        console.log(`Slider`, props);
    },

    state: (props) => {
        console.log(`State`, props);
    },

    textbox: (props) => {

        const finalResult = displayOptions(props);
        const id = props.elem_id ? `gradio_${props.elem_id}` : null;

        if (props.show_label && props.label && id !== null) {
            finalResult.append($('<label>', { for: id, class: 'form-label' }).text(props.label));
        }

        const tinyNoteSpacing = (event) => {
            const element = event.target;
            element.style.height = `${Number(element.scrollHeight)}px`;
        };

        const textarea = $(`<textarea>`, {
            id: id !== null ? id : null,
            placeholder: props.placeholder,
            class: 'form-control form-control-bg'
        }).on('keypress keyup keydown', tinyNoteSpacing);

        textarea.val(props.value);
        finalResult.append(textarea);

        if (props.show_copy_button) {
            finalResult.append($('<button>', { class: `btn btn-primary` }).text('Copy text')).on('click', () => {
                try {

                    const data = textarea.val().trim();

                    if (data.length > 0) {
                        copyToClipboard(data);
                        toast('Text successfully copied to the clipboard.');
                    }

                } catch (err) {
                    console.error(err);
                    alert(err.message);
                }
            });
        }

        return finalResult;

    },

    timeseries: (props) => {
        console.log(`Timeseries`, props);
    },

    uploadbutton: (props) => {
        console.log(`UploadButton`, props);
    },

    video: (props) => {
        console.log(`Video`, props);
    },

};

// Children
const childrenLoader = (items, config) => {
    if (Array.isArray(items)) {

        // HTML Items
        const html = [];

        // Read Data
        for (const item in items) {
            if (objType(items[item], 'object') && typeof items[item].id === 'number' && !Number.isNaN(items[item].id) && Number.isFinite(items[item].id)) {

                // Page Data
                let page;
                if (Array.isArray(items[item].children) && items[item].children.length > 0) page = childrenLoader(items[item].children, config);

                // Componet
                const component = config.components.find(c => c.id === items[item].id);
                if (objType(component, 'object') && objType(component.props, 'object') && typeof component.type === 'string' && typeof components[component.type] === 'function') {
                    const tinyHtml = components[component.type](component.props);
                    if (page) tinyHtml.append(page);
                    html.push(tinyHtml);
                }

            }
        }

        // Complete
        return html;

    }
};

export function getHtml(app) {
    if (
        objType(app, 'object') && objType(app.config, 'object') && objType(app.config.layout, 'object') &&
        Array.isArray(app.config.layout.children) && app.config.layout.children.length > 0 &&
        Array.isArray(app.config.components) && app.config.components.length > 0
    ) {

        // Get Children
        const page = childrenLoader(app.config.layout.children, app.config);
        console.log(app.config, page);

        // Complete
        return page;

    }
};