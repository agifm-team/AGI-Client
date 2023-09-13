import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';

import { objType, toast } from '../../../../src/util/tools';
import { copyToClipboard } from '../../../../src/util/common';
import initMatrix from '../../../../src/client/initMatrix';
import openTinyURL from '../../../../src/util/message/urlProtection';

const labelCreator = (icon, props, id) => $('<label>', { for: id, class: 'form-label' }).text(props.label).prepend(icon);
const displayOptions = (props, id) => $('<div>', { class: `${!props.visible ? 'd-none ' : ''}my-2`, component: id, component_type: props.name }).data('gradio_props', props);

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

        a: (tagName, attribs) => ({
            tagName,
            attribs: {
                ...attribs,
                target: '_blank',
            },
        }),

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

    html: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        finalResult.data('gradio_props', component.props);

        const html = $(sanitizeHtml(component.props.value, htmlAllowed));
        html.find('a').on('click', (event) => {
            const e = event.originalEvent;
            e.preventDefault(); openTinyURL($(event.currentTarget).attr('href'), $(event.currentTarget).attr('href')); return false;
        });

        finalResult.append(html);
        return finalResult;

    },

    markdown: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        finalResult.data('gradio_props', component.props);

        const html = $(sanitizeHtml(marked.parse(component.props.value), htmlAllowed));
        html.find('a').on('click', (event) => {
            const e = event.originalEvent;
            e.preventDefault(); openTinyURL($(event.currentTarget).attr('href'), $(event.currentTarget).attr('href')); return false;
        });

        finalResult.append(html);
        return finalResult;

    },

    audio: (component, compId) => {
        console.log(`Audio`, component, compId);
    },

    barplot: (component, compId) => {
        console.log(`BarPlot`, component, compId);
    },


    button: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        const id = component.props.elem_id ? `gradio_${component.props.elem_id}` : null;
        finalResult.attr('id', id).addClass('button').addClass('d-grid');

        finalResult.append($('<button>', {
            class: `btn btn-${component.props.variant ? component.props.variant : 'bg'}${typeof component.props.size === 'string' && component.props.size.length > 0 ? ` btn-${component.props.size}` : ''}`,
        }).text(component.props.value));

        if (component.props.interactive) {

        }

        return finalResult;

    },

    chatbot: (component, compId) => {
        console.log(`Chatbot`, component, compId);
    },

    checkbox: (component, compId) => {
        console.log(`Checkbox`, component, compId);
    },

    checkboxgroup: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        const id = component.props.elem_id ? `gradio_${component.props.elem_id}` : null;
        finalResult.attr('id', id).addClass('checkboxgroup');

        if (component.props.show_label && component.props.label) {
            finalResult.append(labelCreator(null, component.props));
        }

        if (Array.isArray(component.props.choices) && component.props.choices.length > 0) {

            for (const item in component.props.choices) {
                if (typeof component.props.choices[item] === 'string') {

                    const input = $(`<div>`, { class: 'form-check' }).append(
                        $('<input>', { id: id !== null ? id + item : null, class: 'form-check-input', type: 'checkbox', value: component.props.choices[item] }).prop('checked', (Array.isArray(component.props.value) && component.props.value.length > 0 && component.props.value.indexOf(component.props.choices[item]) > -1)),
                        $('<label>', { for: id !== null ? id + item : null, class: 'form-check-label' }).text(component.props.choices[item]),
                    );

                    finalResult.append(input);

                }
            }

        }

        return finalResult;

    },

    clearbutton: (component, compId) => {
        console.log(`ClearButton`, component, compId);
    },

    code: (component, compId) => {
        console.log(`Code`, component, compId);
    },

    colorpicker: (component, compId) => {
        console.log(`ColorPicker`, component, compId);
    },

    dataframe: (component, compId) => {
        console.log(`Dataframe`, component, compId);
    },

    dataset: (component, compId) => {
        console.log(`Dataset`, component, compId);
    },

    dropdown: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        const id = component.props.elem_id ? `gradio_${component.props.elem_id}` : null;
        finalResult.addClass('dropdown')

        if (component.props.show_label && component.props.label) {
            finalResult.append(labelCreator(null, component.props, id));
        }

        const dropdown = $(`<select>`, {
            id: id !== null ? id : null,
            class: 'form-control form-control-bg'
        });

        if (Array.isArray(component.props.choices) && component.props.choices.length > 0) {

            for (const item in component.props.choices) {
                if (typeof component.props.choices[item] === 'string') {
                    dropdown.append($('<option>', { value: component.props.choices[item] }).text(component.props.choices[item]));
                }
            }

            if (component.props.allow_custom_value) {
                dropdown.append($('<option>', { value: 'custom' }).text('Custom'));
            }

            dropdown.val(component.props.value);

            if (component.props.allow_custom_value) {
                dropdown.append($('<input>', { type: 'text', value: component.props.value, readonly: (component.props.choices.indexOf(component.props.value) > -1) }));
            }

            finalResult.append(dropdown);

        }

        return finalResult;

    },

    duplicatebutton: (component, compId) => {
        console.log(`DuplicateButton`, component, compId);
    },

    file: (component, compId) => {
        console.log(`File`, component, compId);
    },

    gallery: (component, compId, url) => {

        let tinyUrl = url;
        const finalResult = displayOptions(component.props, compId);
        const id = component.props.elem_id ? `gradio_${component.props.elem_id}` : null;
        finalResult.attr('id', id).addClass('gallery').addClass('card').addClass('p-3');

        if (typeof tinyUrl === 'string' && tinyUrl.length > 0) {
            if (tinyUrl.startsWith('/')) {
                tinyUrl = `${tinyUrl.substring(0, tinyUrl.length - 1)}/file=`;
            } else {
                tinyUrl = `${tinyUrl}/file=`;
            }
        } else { tinyUrl = ''; }

        if (component.props.show_label && component.props.label) {
            finalResult.append(labelCreator(null, component.props, `${id}_image`));
        }

        const gallery = $('<div>', { class: 'row' });

        if (typeof component.props.grid_cols === 'number' && !Number.isNaN(component.props.grid_cols) && Number.isFinite(component.props.grid_cols) && component.props.grid_cols <= 12 && rowsList[component.props.grid_cols]) {

            if (Array.isArray(rowsList[component.props.grid_cols]) && Array.isArray(component.props.value)) {

                let rowNumber = 0;

                for (const item in component.props.value) {

                    let imgUrl = component.props.value[item][0].name;
                    if (!imgUrl.startsWith('https://') && !imgUrl.startsWith('http://')) {
                        imgUrl = `${tinyUrl}${imgUrl}`;
                    }

                    gallery.append($('<div>', { class: `col-${rowsList[component.props.grid_cols][rowNumber]}` }).append(

                        $('<button>', { class: 'w-100' }).append(

                            objType(component.props.value[item][0], 'object') && typeof component.props.value[item][0].name === 'string' && component.props.value[item][0].name.length > 0 ?
                                $('<div>', { class: 'avatar border border-bg' }).css({ 'background-image': `url('${imgUrl}')` }).data('gradio_props_gallery_item', component.props.value[item]) : null,
                            typeof component.props.value[item][1] === 'string' ? $('<div>', { class: 'text-bg' }).text(component.props.value[item][1]) : null

                        )

                    ));

                    rowNumber++;
                    if (typeof rowsList[component.props.grid_cols][rowNumber] !== 'number') {
                        rowNumber = 0;
                    }

                }

            }

        }

        finalResult.append(gallery);

        if (component.props.show_share_button) {

        }

        return finalResult;

    },

    highlightedtext: (component, compId) => {
        console.log(`HighlightedText`, component, compId);
    },

    image: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        const id = component.props.elem_id ? `gradio_${component.props.elem_id}` : null;
        finalResult.attr('id', id).addClass('image');

        const img = $('<div>', { class: 'image-preview ratio ratio-16x9 border border-bg' });

        if (component.props.show_label && component.props.label) {
            finalResult.append(labelCreator(null, component.props, `${id}_image`));
        }

        if (component.props.tool === 'editor' && component.props.source === 'upload') {

            if (component.props.interactive !== false) {
                finalResult.append($('<input>', { class: 'form-control', type: 'file', id: `${id}_image` }));
            }

            finalResult.append(img);

        }

        if (component.props.show_share_button) {

        }

        if (component.props.show_download_button) {

        }

        return finalResult;

    },

    interpretation: (component, compId) => {
        console.log(`Interpretation`, component, compId);
    },

    json: (component, compId) => {
        console.log(`JSON`, component, compId);
    },

    label: (component, compId) => {
        console.log(`Label`, component, compId);
    },

    lineplot: (component, compId) => {
        console.log(`LinePlot`, component, compId);
    },

    loginbutton: (component, compId) => {
        console.log(`LoginButton`, component, compId);
    },

    logoutbutton: (component, compId) => {
        console.log(`LogoutButton`, component, compId);
    },

    model3d: (component, compId) => {
        console.log(`Model3D`, component, compId);
    },

    number: (component, compId) => {
        console.log(`Number`, component, compId);
    },

    plot: (component, compId) => {
        console.log(`Plot`, component, compId);
    },

    radio: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        const id = component.props.elem_id ? `gradio_${component.props.elem_id}` : null;
        finalResult.attr('id', id).addClass('radio');

        if (component.props.show_label && component.props.label) {
            finalResult.append(labelCreator(null, component.props, id));
        }

        if (Array.isArray(component.props.choices) && component.props.choices.length > 0) {

            for (const item in component.props.choices) {
                if (typeof component.props.choices[item] === 'string') {

                    const input = $(`<div>`, { class: 'form-check' }).append(
                        $('<input>', { id: id !== null ? id + item : null, class: 'form-check-input', type: 'radio', value: component.props.choices[item], name: id, }),
                        $('<label>', { for: id !== null ? id + item : null, class: 'form-check-label' }).text(component.props.choices[item]),
                    );

                    finalResult.append(input);

                }
            }

            const $radios = finalResult.find(`input:radio[name="${id}"]`);
            if ($radios.is(':checked') === false) {
                $radios.filter(`[value="${component.props.value}"]`).prop('checked', true);
            }

        }

        return finalResult;

    },

    scatterplot: (component, compId) => {
        console.log(`ScatterPlot`, component, compId);
    },

    slider: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        const id = component.props.elem_id ? `gradio_${component.props.elem_id}` : null;
        finalResult.attr('id', id).addClass('slider');

        if (component.props.show_label && component.props.label) {
            finalResult.append(labelCreator(null, component.props, id));
        }

        const input = $('<input>', { type: 'range', class: 'form-range', max: component.props.maximum, min: component.props.minimum, step: component.props.step });
        const numberInput = $('<input>', { class: 'form-control form-control-bg form-control-slider float-end', type: 'number', max: component.props.maximum, min: component.props.minimum, step: component.props.step });
        finalResult.append(numberInput);

        numberInput.on('change keypress keydown keyup', () => {

            const value = Number(numberInput.val());
            const value2 = Number(input.val());
            const max = Number(numberInput.attr('max'));
            const min = Number(numberInput.attr('min'));

            if (!Number.isNaN(max) && Number.isFinite(max) && !Number.isNaN(min) && Number.isFinite(min)) {

                if (!Number.isNaN(value) && Number.isFinite(value)) {
                    if (value > max) numberInput.val(max);
                    if (value < min) numberInput.val(min);
                } else {
                    numberInput.val(min);
                }

                if (value !== value2) input.val(value);

            }

        });

        input.on('change keypress keydown keyup', () => {
            const value = Number(numberInput.val());
            const value2 = Number(input.val());
            if (value !== value2) numberInput.val(value2);
        });

        finalResult.append(input);

        input.val(component.props.value);
        numberInput.val(component.props.value);

        return finalResult;

    },

    state: (component, compId) => {
        console.log(`State`, component, compId);
    },

    textbox: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        const id = component.props.elem_id ? `gradio_${component.props.elem_id}` : null;
        finalResult.addClass('textbox')

        if (component.props.show_label && component.props.label) {
            finalResult.append(labelCreator(null, component.props, `${id}_textbox`));
        }

        const isTextInput = (component.props.lines === 1 && component.props.max_lines === 1);

        const tinyNoteSpacing = (event) => {
            if (!isTextInput) {
                const element = event.target;
                element.style.height = `${Number(element.scrollHeight)}px`;
            }
        };

        const textarea = $(`<${isTextInput ? 'input' : 'textarea'}>`, {
            id: id !== null ? `${id}_textbox` : null,
            rows: component.props.lines,
            maxrows: component.props.max_lines,
            placeholder: component.props.placeholder,
            class: 'form-control form-control-bg'
        }).on('keypress keyup keydown', tinyNoteSpacing);

        textarea.val(component.props.value);
        finalResult.append(textarea);

        if (component.props.show_copy_button) {
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

    timeseries: (component, compId) => {
        console.log(`Timeseries`, component, compId);
    },

    uploadbutton: (component, compId) => {
        console.log(`UploadButton`, component, compId);
    },

    video: (component, compId) => {
        console.log(`Video`, component, compId);
    },

    column: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        const id = component.props.elem_id ? `gradio_${component.props.elem_id}` : null;
        finalResult.attr('id', id).addClass('p-2').addClass('column');

        if (component.props.show_label && typeof component.props.label === 'string') {
            finalResult.append($('<div>', { id }).text(component.props.label));
        }

        return finalResult;

    },

    row: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        const id = component.props.elem_id ? `gradio_${component.props.elem_id}` : null;
        finalResult.attr('id', id).addClass('row');

        if (component.props.show_label && typeof component.props.label === 'string') {
            finalResult.append($('<div>', { id }).text(component.props.label));
        }

        return finalResult;

    },

    accordion: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        const id = component.props.elem_id ? `gradio_${component.props.elem_id}` : null;
        finalResult.attr('id', id).addClass('accordion');

        const collapseId = `${id}_collapse_${compId}`;

        if (typeof component.props.label === 'string') {

            const collapse = $('<div>', { class: 'collapse', id: collapseId });
            const button = $('<button>', {
                class: 'btn ic-btn ic-btn-link btn-bg btn-link btn-bg btn-text-link btn-bg',
                type: 'button',
                'data-bs-toggle': 'collapse',
                'aria-expanded': component.props.open ? 'true' : 'false',
                'aria-controls': collapseId,
                'data-bs-target': `#${collapseId}`
            }).text(component.props.label).append(
                $('<i>', { class: `collapse-button float-end ms-2 ic-base ic-fa ic-fa-normal fa-solid fa-caret-${component.props.open ? 'down' : 'left'}` })
            );

            collapse.on('hide.bs.collapse', () => {
                const target = button.find('> .ic-base');
                target.removeClass('fa-caret-left').removeClass('fa-caret-down');
                target.addClass('fa-caret-left');
            }).on('show.bs.collapse', () => {
                const target = button.find('> .ic-base');
                target.removeClass('fa-caret-left').removeClass('fa-caret-down');
                target.addClass('fa-caret-down');
            });

            finalResult.append($('<div>', { id, class: 'card' }).append($('<div>', { class: 'card-body p-2' }).append(
                $('<span>', { class: 'd-grid' }).append(button),
                collapse
            )));

        }

        return finalResult;

    },

    form: (component, compId) => {

        const finalResult = displayOptions(component.props, compId);
        const id = component.props.elem_id ? `gradio_${component.props.elem_id}` : null;
        finalResult.attr('id', id).addClass('form');

        if (component.props.show_label && typeof component.props.label === 'string') {
            finalResult.append($('<div>', { id }).text(component.props.label));
        }

        return finalResult;

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

                    if (existChildrens && (component.type === 'row' || component.type === 'accordion')) {

                        if (component.type === 'row') {

                            const rowItems = rowsList[items[item].children.length];
                            let rowItem = 0;
                            newPage.forEach(item2 => {
                                page.push($('<div>', { class: `col-md-${rowItems[rowItem]}` }).append(item2));
                                if (rowItem > rowItems) rowItem = 0;
                            });

                        }

                    } else {
                        page = newPage;
                    }

                    const tinyHtml = components[component.type](component, component.id, url);
                    if (component.type === 'accordion') {
                        tinyHtml.find('.card .card-body .collapse').append(newPage);
                    }

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