import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';

import { objType, toast } from '../../../../src/util/tools';
import { copyToClipboard } from '../../../../src/util/common';
import initMatrix from '../../../../src/client/initMatrix';

const labelCreator = (props, id) => $('<label>', { for: id, class: 'form-label' }).text(props.label);
const displayOptions = (props, id) => $('<div>', { class: `${!props.visible ? 'd-none ' : ''}my-2`, component: id }).data('gradio_props', props);

/*

   Soon I will add another security script here, which is the href detector, to add a layer of warning that the user is going to a third-party page. 

*/

const rowsList = {
    1: [12],
    2: [6, 6],
    3: [4, 4, 4],
    4: [3, 3, 3, 3],
    5: [2, 2, 4, 2, 2],
    6: [2, 2, 2, 2, 2, 2],
    7: [1, 2, 2, 2, 2, 2, 1],
    8: [2, 1, 1, 2, 2, 1, 1, 2],
    9: [2, 1, 1, 1, 2, 1, 1, 1, 2],
    10: [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    11: [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    12: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
};

const htmlAllowed = {

    transformTags: {
        img: (tagName, attribs) => {

            const mx = initMatrix.matrixClient;
            const { src } = attribs;

            if (src.startsWith('mxc://') === true) {
                return {
                    tagName,
                    attribs: {
                        ...attribs,
                        src: mx?.mxcUrlToHttp(src),
                        class: 'img-fluid',
                    },
                };
            }

            return {
                tagName,
                attribs: {
                    ...attribs,
                    class: 'img-fluid',
                },
            };

        },
    },

    allowedTags: [
        'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4',
        'h5', 'h6', 'hgroup', 'main', 'nav', 'section', 'blockquote', 'dd', 'div',
        'dl', 'dt', 'figcaption', 'figure', 'hr', 'li', 'main', 'ol', 'p', 'pre',
        'ul', 'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn',
        'em', 'i', 'kbd', 'mark', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp',
        'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr', 'caption',
        'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'img'
    ],

    allowedAttributes: {
        a: ['href', 'name', 'target'],
        // We don't currently allow img itself by default, but
        // these attributes would make sense if we did.
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'class']
    },

};

// Components
const components = {

    audio: (props, compId) => {
        console.log(`Audio`, props, compId);
    },

    barplot: (props, compId) => {
        console.log(`BarPlot`, props, compId);
    },

    button: (props) => $('<button>', {
        id: props.elem_id ? `gradio_${props.elem_id}` : null,
        class: `${!props.visible ? 'd-none ' : ''}btn btn-${props.variant ? props.variant : 'bg'}`
    }).data('gradio_props', props).text(props.value),

    chatbot: (props, compId) => {
        console.log(`Chatbot`, props, compId);
    },

    checkbox: (props, compId) => {
        console.log(`Checkbox`, props, compId);
    },

    checkboxgroup: (props, compId) => {

        const finalResult = displayOptions(props, compId);
        const id = props.elem_id ? `gradio_${props.elem_id}` : null;
        finalResult.attr('id', id).addClass('checkboxgroup');

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(props));
        }

        if (Array.isArray(props.choices) && props.choices.length > 0) {

            for (const item in props.choices) {
                if (typeof props.choices[item] === 'string') {

                    const input = $(`<div>`, { class: 'form-check' }).append(
                        $('<input>', { id: id !== null ? id + item : null, class: 'form-check-input', type: 'checkbox', value: props.choices[item] }).prop('checked', (Array.isArray(props.value) && props.value.length > 0 && props.value.indexOf(props.choices[item]) > -1)),
                        $('<label>', { for: id !== null ? id + item : null, class: 'form-check-label' }).text(props.choices[item]),
                    );

                    finalResult.append(input);

                }
            }

        }

        return finalResult;

    },

    clearbutton: (props, compId) => {
        console.log(`ClearButton`, props, compId);
    },

    code: (props, compId) => {
        console.log(`Code`, props, compId);
    },

    colorpicker: (props, compId) => {
        console.log(`ColorPicker`, props, compId);
    },

    dataframe: (props, compId) => {
        console.log(`Dataframe`, props, compId);
    },

    dataset: (props, compId) => {
        console.log(`Dataset`, props, compId);
    },

    dropdown: (props, compId) => {

        const finalResult = displayOptions(props, compId);
        const id = props.elem_id ? `gradio_${props.elem_id}` : null;
        finalResult.addClass('dropdown')

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(props, id));
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

    duplicatebutton: (props, compId) => {
        console.log(`DuplicateButton`, props, compId);
    },

    file: (props, compId) => {
        console.log(`File`, props, compId);
    },

    gallery: (props, compId, url) => {

        let tinyUrl = url;
        const finalResult = displayOptions(props, compId);
        const id = props.elem_id ? `gradio_${props.elem_id}` : null;
        finalResult.attr('id', id).addClass('gallery').addClass('card').addClass('p-3');

        if (typeof tinyUrl === 'string' && tinyUrl.length > 0) {
            if (tinyUrl.startsWith('/')) {
                tinyUrl = `${tinyUrl.substring(0, tinyUrl.length - 1)}/file=`;
            } else {
                tinyUrl = `${tinyUrl}/file=`;
            }
        } else { tinyUrl = ''; }

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(props, `${id}_image`));
        }

        const gallery = $('<div>', { class: 'row' });

        if (typeof props.grid_cols === 'number' && !Number.isNaN(props.grid_cols) && Number.isFinite(props.grid_cols) && props.grid_cols <= 12 && rowsList[props.grid_cols]) {

            if (Array.isArray(rowsList[props.grid_cols]) && Array.isArray(props.value)) {

                let rowNumber = 0;

                for (const item in props.value) {

                    let imgUrl = props.value[item][0].name;
                    if (!imgUrl.startsWith('https://') && !imgUrl.startsWith('http://')) {
                        imgUrl = `${tinyUrl}${imgUrl}`;
                    }

                    gallery.append($('<div>', { class: `col-${rowsList[props.grid_cols][rowNumber]}` }).append(

                        $('<button>', { class: 'w-100' }).append(

                            objType(props.value[item][0], 'object') && typeof props.value[item][0].name === 'string' && props.value[item][0].name.length > 0 ?
                                $('<div>', { class: 'avatar border border-bg' }).css({ 'background-image': `url('${imgUrl}')` }).data('gradio_props_gallery_item', props.value[item]) : null,
                            typeof props.value[item][1] === 'string' ? $('<div>', { class: 'text-bg' }).text(props.value[item][1]) : null

                        )

                    ));

                    rowNumber++;
                    if (typeof rowsList[props.grid_cols][rowNumber] !== 'number') {
                        rowNumber = 0;
                    }

                }

            }

        }

        finalResult.append(gallery);

        if (props.show_share_button) {

        }

        return finalResult;

    },

    html: (props, compId) => displayOptions(props, compId).append($(sanitizeHtml(props.value, htmlAllowed))).data('gradio_props', props),

    highlightedtext: (props, compId) => {
        console.log(`HighlightedText`, props, compId);
    },

    image: (props, compId) => {

        const finalResult = displayOptions(props, compId);
        const id = props.elem_id ? `gradio_${props.elem_id}` : null;
        finalResult.attr('id', id).addClass('image');

        const img = $('<img>', { alt: 'image', class: 'img-fluid' }).css({ 'max-height': '124px' });

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(props, `${id}_image`));
        }

        if (props.tool === 'editor' && props.source === 'upload') {

            if (props.interactive !== false) {
                finalResult.append($('<input>', { class: 'form-control', type: 'file', id: `${id}_image` }));
            }

        }

        if (props.show_share_button) {

        }

        if (props.show_download_button) {

        }

        return finalResult;

    },

    interpretation: (props, compId) => {
        console.log(`Interpretation`, props, compId);
    },

    json: (props, compId) => {
        console.log(`JSON`, props, compId);
    },

    label: (props, compId) => {
        console.log(`Label`, props, compId);
    },

    lineplot: (props, compId) => {
        console.log(`LinePlot`, props, compId);
    },

    loginbutton: (props, compId) => {
        console.log(`LoginButton`, props, compId);
    },

    logoutbutton: (props, compId) => {
        console.log(`LogoutButton`, props, compId);
    },

    markdown: (props, compId) => displayOptions(props, compId).append($(sanitizeHtml(marked.parse(props.value), htmlAllowed))).data('gradio_props', props),

    model3d: (props, compId) => {
        console.log(`Model3D`, props, compId);
    },

    number: (props, compId) => {
        console.log(`Number`, props, compId);
    },

    plot: (props, compId) => {
        console.log(`Plot`, props, compId);
    },

    radio: (props, compId) => {

        const finalResult = displayOptions(props, compId);
        const id = props.elem_id ? `gradio_${props.elem_id}` : null;
        finalResult.attr('id', id).addClass('radio');

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(props, id));
        }

        if (Array.isArray(props.choices) && props.choices.length > 0) {

            for (const item in props.choices) {
                if (typeof props.choices[item] === 'string') {

                    const input = $(`<div>`, { class: 'form-check' }).append(
                        $('<input>', { id: id !== null ? id + item : null, class: 'form-check-input', type: 'radio', value: props.choices[item], name: id, }),
                        $('<label>', { for: id !== null ? id + item : null, class: 'form-check-label' }).text(props.choices[item]),
                    );

                    finalResult.append(input);

                }
            }

            const $radios = finalResult.find(`input:radio[name="${id}"]`);
            if ($radios.is(':checked') === false) {
                $radios.filter(`[value="${props.value}"]`).prop('checked', true);
            }

        }

        return finalResult;

    },

    scatterplot: (props, compId) => {
        console.log(`ScatterPlot`, props, compId);
    },

    slider: (props, compId) => {

        const finalResult = displayOptions(props, compId);
        const id = props.elem_id ? `gradio_${props.elem_id}` : null;
        finalResult.attr('id', id).addClass('slider');

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(props, id));
        }

        finalResult.append($('<input>', { type: 'range', class: 'form-range', max: props.maximum, min: props.minimum, step: props.step }));

        return finalResult;

    },

    state: (props, compId) => {
        console.log(`State`, props, compId);
    },

    textbox: (props, compId) => {

        const finalResult = displayOptions(props, compId);
        const id = props.elem_id ? `gradio_${props.elem_id}` : null;
        finalResult.addClass('textbox')

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(props, `${id}_textbox`));
        }

        const tinyNoteSpacing = (event) => {
            const element = event.target;
            element.style.height = `${Number(element.scrollHeight)}px`;
        };

        const textarea = $(`<textarea>`, {
            id: id !== null ? `${id}_textbox` : null,
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

    timeseries: (props, compId) => {
        console.log(`Timeseries`, props, compId);
    },

    uploadbutton: (props, compId) => {
        console.log(`UploadButton`, props, compId);
    },

    video: (props, compId) => {
        console.log(`Video`, props, compId);
    },

    column: (props, compId) => {

        const finalResult = displayOptions(props, compId);
        const id = props.elem_id ? `gradio_${props.elem_id}` : null;
        finalResult.attr('id', id).addClass('p-2').addClass('column');

        if (props.show_label && typeof props.label === 'string') {
            finalResult.append($('<div>', { id }).text(props.label));
        }

        return finalResult;

    },

    row: (props, compId) => {

        const finalResult = displayOptions(props, compId);
        const id = props.elem_id ? `gradio_${props.elem_id}` : null;
        finalResult.attr('id', id).addClass('row');

        if (props.show_label && typeof props.label === 'string') {
            finalResult.append($('<div>', { id }).text(props.label));
        }

        return finalResult;

    },

    accordion: (props, compId) => {
        console.log(`Row`, props, compId);
    },

    form: (props, compId) => {
        console.log(`Form`, props, compId);
    },

};

// Children
const childrenLoader = (items, config, url) => {
    if (Array.isArray(items)) {

        // HTML Items
        const html = [];

        // Read Data
        for (const item in items) {
            if (objType(items[item], 'object') && typeof items[item].id === 'number' && !Number.isNaN(items[item].id) && Number.isFinite(items[item].id)) {

                // Page Data
                let page = [];
                let newPage;
                const existChildrens = (Array.isArray(items[item].children) && items[item].children.length > 0);
                if (existChildrens) newPage = childrenLoader(items[item].children, config, url);

                // Componet
                const component = config.components.find(c => c.id === items[item].id);
                if (objType(component, 'object') && objType(component.props, 'object') && typeof component.type === 'string' && typeof components[component.type] === 'function') {

                    if (existChildrens && component.type === 'row') {

                        const rowItems = rowsList[items[item].children.length];
                        let rowItem = 0;
                        newPage.forEach(item2 => {
                            page.push($('<div>', { class: `col-md-${rowItems[rowItem]}` }).append(item2));
                            if (rowItem > rowItems) rowItem = 0;
                        });

                    } else {
                        page = newPage;
                    }

                    const tinyHtml = components[component.type](component.props, component.id, url);
                    if (typeof tinyHtml !== 'undefined') {
                        if (page) tinyHtml.append(page);
                        html.push(tinyHtml);
                    }

                }

            }
        }

        // Complete
        return html;

    }
};

export function getHtml(config, cssBase, url = '') {
    if (
        objType(config, 'object') && objType(config.layout, 'object') &&
        Array.isArray(config.layout.children) && config.layout.children.length > 0 &&
        Array.isArray(config.components) && config.components.length > 0
    ) {

        // Get Children
        const page = childrenLoader(config.layout.children, config, url);
        if (typeof config.css === 'string' && config.css.length > 0 && typeof cssBase === 'string' && cssBase.length > 0) {

            const tinyStyle = sass.compileString(`${cssBase} {
                ${config.css}
            }`);

            if (typeof tinyStyle.css === 'string') page.push($('<style>').append(tinyStyle.css));

        }

        console.log(config, page);

        // Complete
        return page;

    }
};