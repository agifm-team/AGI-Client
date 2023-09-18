import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';

import { hljsFixer, objType, toast } from '../../../../src/util/tools';
import { copyToClipboard } from '../../../../src/util/common';
import initMatrix from '../../../../src/client/initMatrix';
import openTinyURL from '../../../../src/util/message/urlProtection';
import { bootstrapItems } from '../../../../src/util/styles-bootstrap';

const labelCreator = (icon, props, id) => $('<label>', { for: id, class: 'form-label' }).text(props.label).prepend(icon);
const displayOptions = (props, id, appId) => {
    props.app_id = appId;
    return $('<div>', { class: `${!props.visible ? 'd-none ' : ''}my-2`, component: id, place_id: appId, component_type: props.name }).data('gradio_props', props);
};

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

const fileUrlGenerator = (url) => {

    let tinyUrl = url;

    if (typeof tinyUrl === 'string' && tinyUrl.length > 0) {
        if (tinyUrl.startsWith('/')) {
            tinyUrl = `${tinyUrl.substring(0, tinyUrl.length - 1)}/file=`;
        } else {
            tinyUrl = `${tinyUrl}/file=`;
        }
    } else { tinyUrl = ''; }

    if (tinyUrl.endsWith('//file=')) tinyUrl = `${tinyUrl.substring(0, tinyUrl.length - 7)}/file=`;

    return tinyUrl;

}

const datasetComponents = {

    video: (fileName, url, td) => {

        const video = $('<video>', { src: `${fileUrlGenerator(url)}${fileName}`, class: 'img-fluid' });
        video.prop('muted', true).prop('playsinline', true);

        td.on('mouseover', () => video.get(0).play());
        td.on('mouseout', () => video.get(0).pause());
        return video;

    }

};

// Components
// https://www.gradio.app/docs
const components = {

    html: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        finalResult.data('gradio_props', props);

        const html = $(sanitizeHtml(props.value, htmlAllowed));
        html.find('a').on('click', (event) => {
            const e = event.originalEvent;
            e.preventDefault(); openTinyURL($(event.currentTarget).attr('href'), $(event.currentTarget).attr('href')); return false;
        });

        finalResult.append(html);
        return finalResult;

    },

    markdown: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        finalResult.data('gradio_props', props);

        const html = $(sanitizeHtml(marked.parse(props.value), htmlAllowed));
        html.find('a').on('click', (event) => {
            const e = event.originalEvent;
            e.preventDefault(); openTinyURL($(event.currentTarget).attr('href'), $(event.currentTarget).attr('href')); return false;
        });

        finalResult.append(html);
        return finalResult;

    },

    audio: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('audio');

        const exampleIcon = $('<i>', { class: 'fa-solid fa-music' });
        const img = $('<div>', { class: 'audio-preview border border-bg' }).append(exampleIcon);

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(null, props, `${id}_image`));
        }

        if (props.interactive !== false) {

            if (props.source === 'upload') {
                finalResult.append($('<input>', { class: 'form-control form-control-bg', type: 'file', id: `${id}_image`, accept: 'audio/*' }));
            }

        }

        finalResult.append(img);

        if (props.show_share_button) {

        }

        if (props.show_download_button) {

        }

        return finalResult;

    },

    // https://www.chartjs.org/docs/latest/charts/bar.html
    barplot: (props, compId, appId) => {
        console.log(`BarPlot`, props, compId);
    },


    button: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('button').addClass('d-grid');

        if (props.variant === 'stop') props.variant = 'danger';

        const sizes = {
            normal: 20,
            sm: 15,
            lg: 30,
        };

        const sizeSelected = typeof props.size === 'string' && props.size.length > 0 ? props.size : 'normal';


        const button = $('<button>', {
            class: `btn btn-${props.variant ? props.variant : 'bg'}${typeof props.size === 'string' && props.size.length > 0 ? ` btn-${props.size}` : ''}`,
        }).text(props.value);

        if (typeof props.icon === 'string' && props.icon.length > 0) {
            button.prepend(
                $('<img>', { src: props.icon, alt: 'icon', class: 'img-fluid me-2' }).css('height', sizes[sizeSelected])
            );
        }

        button.prop('disabled', (props.interactive === false));

        finalResult.append(button);
        return finalResult;

    },

    chatbot: (props, compId, appId) => {
        console.log(`Chatbot`, props, compId);
    },

    checkbox: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('checkbox').addClass('w-100').addClass('text-start').addClass('h-100');

        const input = $(`<div>`, { class: 'form-check border border-bg checkboxradio-group w-100 p-2' }).append(
            $('<input>', { id: `${id}_individual`, class: 'form-check-input', type: 'checkbox' }).prop('checked', (props.value === true)).prop('disabled', (props.interactive === false)),
            $('<label>', { for: `${id}_individual`, class: 'form-check-label' }).text(props.show_label && typeof props.label === 'string' ? props.label : 'Checkbox'),
        );

        finalResult.append(input);

        return finalResult;

    },

    checkboxgroup: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('checkboxgroup');

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(null, props));
        }

        if (Array.isArray(props.choices) && props.choices.length > 0) {

            for (const item in props.choices) {
                if (typeof props.choices[item] === 'string') {

                    const input = $(`<div>`, { class: 'form-check border border-bg checkboxradio-group' }).append(
                        $('<input>', { id: id !== null ? id + item : null, class: 'form-check-input', type: 'checkbox', value: props.choices[item] }).prop('checked', (Array.isArray(props.value) && props.value.length > 0 && props.value.indexOf(props.choices[item]) > -1)).prop('disabled', (props.interactive === false)),
                        $('<label>', { for: id !== null ? id + item : null, class: 'form-check-label' }).text(props.choices[item]),
                    );

                    finalResult.append(input);

                }
            }

        }

        return finalResult;

    },

    code: (props, compId, appId) => {
        try {

            const finalResult = displayOptions(props, compId, appId);
            const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
            finalResult.attr('id', id).addClass('code');

            if (props.show_label && props.label) {
                finalResult.append(labelCreator(null, props, id));
            }

            const tinyCode = $('<code>', { class: `language-${props.language} hljs text-start` }).append(props.value ? hljs.highlight(
                props.value,
                { language: props.language }
            ).value : '');

            const tinyResult = $('<pre>').append(tinyCode);
            hljsFixer(tinyCode, 'MessageBody');

            finalResult.append(tinyResult);
            return finalResult;

        } catch (err) {
            console.error(err);
            return null;
        }
    },

    colorpicker: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('button').addClass('d-grid');

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(null, props, id));
        }

        finalResult.append($('<input>', { id, class: 'form-control form-control-bg form-control-color', type: 'color' }).prop('disabled', (props.interactive === false)).val(props.value));

        return finalResult;

    },

    dataframe: (props, compId, appId) => {
        console.log(`Dataframe`, props, compId);
    },

    dataset: (props, compId, appId, url) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('dataset');

        if (props.show_label && typeof props.label === 'string') {
            finalResult.append($('<div>', { id }).text(props.label));
        }

        const table = $('<table>', { class: 'table table-hover table-bordered border border-bg' });

        let isSingle = true;

        if (Array.isArray(props.samples) && props.samples.length > 0) {
            for (const item in props.samples) {
                if (Array.isArray(props.samples[item]) && props.samples[item].length > 1) {
                    isSingle = false;
                }
            }
        }

        if (!isSingle && Array.isArray(props.headers) && props.headers.length > 0) {

            const thead = $('<thead>');
            const tr = $('<tr>');

            for (const item in props.headers) {
                if (typeof props.headers[item] === 'string') tr.append($('<th>', { class: 'text-bg-force' }).text(props.headers[item]));
            }

            thead.append(tr);
            table.append(thead);

        } else {
            table.removeClass('table-hover').addClass('table-td-hover');
        }

        if (Array.isArray(props.samples) && props.samples.length > 0) {

            const tbody = $('<tbody>');

            if (!isSingle) {
                for (const item in props.samples) {

                    const tr = $('<tr>');
                    if (Array.isArray(props.samples[item]) && props.samples[item].length > 0) {
                        for (const item2 in props.samples[item]) {
                            if (typeof props.samples[item][item2] === 'string') {

                                if (typeof datasetComponents[props.components[item2]] !== 'function') {
                                    tr.append($('<td>', { class: 'text-bg-force' }).text(props.samples[item][item2]));
                                } else {
                                    const td = $('<td>', { class: 'text-bg-force' });
                                    tr.append(td.append(datasetComponents[props.components[item2]](props.samples[item][item2], url, td, props, compId, appId)));
                                }

                            }
                        }
                    }

                    tbody.append(tr);

                }
            } else {

                const tr = $('<tr>');
                for (const item in props.samples) {
                    if (Array.isArray(props.samples[item]) && props.samples[item].length > 0) {
                        for (const item2 in props.samples[item]) {
                            if (typeof props.samples[item][item2] === 'string') {

                                if (typeof datasetComponents[props.components[item2]] !== 'function') {
                                    tr.append($('<td>', { class: 'text-bg-force' }).text(props.samples[item][item2]));
                                } else {
                                    const td = $('<td>', { class: 'text-bg-force' });
                                    tr.append(td.append(datasetComponents[props.components[item2]](props.samples[item][item2], url, td, props, compId, appId)));
                                }

                            }
                        }
                    }
                }
                tbody.append(tr);

            }

            table.append(tbody);

        }

        finalResult.append(table);
        return finalResult;

    },

    dropdown: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.addClass('dropdown')

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(null, props, id));
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
                dropdown.append($('<input>', { type: 'text', value: props.value }).prop('readonly', (props.choices.indexOf(props.value) > -1)));
            }

            finalResult.append(dropdown);

        }

        return finalResult;

    },

    file: (props, compId, appId) => {
        console.log(`File`, props, compId);
    },

    gallery: (props, compId, appId, url) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('gallery').addClass('border').addClass('border-bg').addClass('p-3');

        const tinyUrl = fileUrlGenerator(url);
        if (props.show_label && props.label) {
            finalResult.append(labelCreator(null, props, `${id}_image`));
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

    highlightedtext: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('highlightedtext');

        if (props.selectable) {

        }

        if (Array.isArray(props.value) && Array.isArray(props.value)) {
            let colorIndex = 0;
            for (const item in props.value) {
                if (Array.isArray(props.value[item])) {

                    const highlight = $('<span>', { class: `border border-bg p-1 mx-1 bg-${bootstrapItems.normal[colorIndex]} bg-opacity-25` });

                    if (typeof props.value[item][0] === 'string' && props.value[item][0].length > 0) {
                        highlight.text(props.value[item][0]);
                    }

                    if (typeof props.value[item][1] === 'string' && props.value[item][1].length > 0 && props.show_label) {
                        highlight.append($('<span>', { class: `ms-2 badge bg-${bootstrapItems.normal[colorIndex]}` }).text(props.value[item][1]));
                    }

                    if (props.show_legend) {

                    }

                    finalResult.append(highlight);

                    colorIndex++;
                    if (typeof bootstrapItems.normal[colorIndex] !== 'string') colorIndex = 0;

                }
            }
        }

        return finalResult;

    },

    image: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('image');

        const exampleIcon = $('<i>', { class: 'fa-solid fa-image' });
        const img = $('<div>', { class: 'image-preview border border-bg' }).append(exampleIcon);

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(null, props, `${id}_image`));
        }

        if (props.interactive !== false) {

            if (props.source === 'upload') {
                finalResult.append($('<input>', { class: 'form-control form-control-bg', type: 'file', id: `${id}_image`, accept: 'image/*' }));
            }

        }

        finalResult.append(img);

        if (props.show_share_button) {

        }

        if (props.show_download_button) {

        }

        return finalResult;

    },

    interpretation: (props, compId, appId) => {
        console.log(`Interpretation`, props, compId);
    },

    json: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('json');

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(null, props, id));
        }

        const tinyJson = $('<div>', { class: 'text-start text-freedom border border-bg p-3 bg-bg2' }).append(props.value ? hljs.highlight(
            JSON.stringify(props.value, null, 4),
            { language: 'json' }
        ).value : '');

        finalResult.append(tinyJson);
        return finalResult;

    },

    label: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('label');

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(null, props, id));
        }

        const tinyLabel = $('<div>', { class: 'border border-bg p-3 bg-bg2' });
        if (objType(props.value, 'object')) {

            if (typeof props.value.label === 'string' && props.value.label.length > 0) {
                tinyLabel.append($('<h2>').text(props.value.label));
            }

            if (Array.isArray(props.value.confidences) && props.value.confidences.length > 0) {
                for (const item in props.value.confidences) {

                    let confidence = Number(props.value.confidences[item].confidence) * 100;
                    if (Number.isNaN(confidence) || !Number.isFinite(confidence) || confidence < 0) confidence = 0;
                    if (confidence > 100) confidence = 100;

                    tinyLabel.append($('<div>', { class: 'mt-2 text-start confidence' }).append(

                        $('<div>', { class: 'progress', role: 'progressbar', 'aria-valuenow': confidence, 'aria-valuemin': 0, 'aria-valuemax': 100 }).append(
                            $('<div>', { class: 'progress-bar' }).css('width', `${confidence}%`)
                        ),

                        $('<table>', { class: 'sub-label' }).append(
                            $('<tbody>').append($('<tr>').append(
                                $('<td>', { class: 'sub-label-title' }).text(props.value.confidences[item].label),
                                $('<td>', { class: 'sub-label-confidence' }).text(`${confidence}%`)
                            ))
                        )

                    ));

                }
            }

        }

        finalResult.append(tinyLabel);
        return finalResult;

    },

    lineplot: (props, compId, appId) => {
        console.log(`LinePlot`, props, compId);
    },

    model3d: (props, compId, appId) => {
        console.log(`Model3D`, props, compId);
    },

    number: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('number');

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(null, props, id));
        }

        const numberInput = $('<input>', { class: 'form-control form-control-bg', type: 'number', max: props.maximum, min: props.minimum, step: props.step }).prop('readonly', (props.interactive === false));
        finalResult.append(numberInput);

        numberInput.on('change keypress keydown keyup', () => {

            const value = Number(numberInput.val());
            const max = Number(numberInput.attr('max'));
            const min = Number(numberInput.attr('min'));

            if (!Number.isNaN(max) && Number.isFinite(max) && !Number.isNaN(min) && Number.isFinite(min)) {

                if (!Number.isNaN(value) && Number.isFinite(value)) {
                    if (value > max) numberInput.val(max);
                    if (value < min) numberInput.val(min);
                } else {
                    numberInput.val(min);
                }

            }

        });

        numberInput.val(typeof props.value === 'number' && !Number.isNaN(props.value) && Number.isFinite(props.value) ? props.value : 0);
        return finalResult;

    },

    plot: (props, compId, appId) => {
        console.log(`Plot`, props, compId);
    },

    radio: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('radio');

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(null, props, id));
        }

        const radioGroup = $('<div>');

        if (Array.isArray(props.choices) && props.choices.length > 0) {

            const tinyName = `gradio_radio_${appId}_${id !== null ? id : null}_${compId}`;
            for (const item in props.choices) {
                if (typeof props.choices[item] === 'string') {

                    const tinyId = `gradio_radio_item_${id !== null ? id : null}_${item}`;

                    const input = $(`<div>`, { class: 'form-check border border-bg checkboxradio-group' }).append(
                        $('<input>', { id: tinyId, class: 'form-check-input', type: 'radio', value: props.choices[item], name: tinyName, }).prop('disabled', (props.interactive === false)),
                        $('<label>', { for: tinyId, class: 'form-check-label' }).text(props.choices[item]),
                    );

                    radioGroup.append(input);

                }
            }

            const $radios = radioGroup.find(`input:radio[name="${tinyName}"]`);
            if ($radios.is(':checked') === false) {
                $radios.filter(`[value="${props.value}"]`).prop('checked', true);
            }

        }

        finalResult.append(radioGroup);
        return finalResult;

    },

    scatterplot: (props, compId, appId) => {
        console.log(`ScatterPlot`, props, compId);
    },

    slider: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('slider');

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(null, props, id));
        }

        const input = $('<input>', { type: 'range', class: 'form-range', max: props.maximum, min: props.minimum, step: props.step }).prop('disabled', (props.interactive === false));
        const numberInput = $('<input>', { class: 'form-control form-control-bg form-control-slider float-end', type: 'number', max: props.maximum, min: props.minimum, step: props.step }).prop('readonly', (props.interactive === false));
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

        input.on('change keypress keydown keyup input', () => {
            const value = Number(numberInput.val());
            const value2 = Number(input.val());
            if (value !== value2) numberInput.val(value2);
        });

        finalResult.append(input);

        input.val(props.value);
        numberInput.val(props.value);

        return finalResult;

    },

    textbox: (props, compId, appId) => {

        // values
        let textboxStopHeight = false;
        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.addClass('textbox')

        if (props.show_label && props.label) {
            finalResult.append(labelCreator(null, props, `${id}_textbox`));
        }

        // Textarea Value
        const isTextInput = (props.lines === 1 && props.max_lines === 1);
        const textarea = $(`<${isTextInput ? 'input' : 'textarea'}>`, {
            id: id !== null ? `${id}_textbox` : null,
            rows: props.lines,
            maxrows: props.max_lines,
            placeholder: props.placeholder,
            class: 'form-control form-control-bg'
        });

        // Spacing Detector
        const tinyNoteSpacing = (event) => {
            if (!isTextInput) {

                // Textarea reset
                textarea.css('height', 0);

                // Target
                const element = event.target;

                // First Numbers
                const textHeight = Number(element.scrollHeight);
                const spacesCount = textarea.val().split('\n').length;
                const maxLines = Number(textarea.attr('maxrows'));

                // Cache
                let finalHeight = textHeight;

                // Space Count
                const heightPerSpace = textHeight / spacesCount;
                const heightMaxPerSpace = textHeight / maxLines;

                // Space Count + Space Count Limit
                const spacePerCalculator = heightPerSpace - heightMaxPerSpace;

                // Active Limit Size
                if (spacesCount > maxLines) {
                    finalHeight = heightPerSpace * maxLines;
                }

                // Insert new height
                textarea.css('height', `${finalHeight}px`);

                // Scroll Protection
                if (spacesCount > maxLines) {
                    textarea.animate({ scrollTop: 9999999 }, 0);
                }

                // Stop Size Detector
                if (spacePerCalculator === 0) {
                    textboxStopHeight = true;
                } else {
                    textboxStopHeight = false;
                }

            }
        };

        textarea.on('keypress keyup keydown change input', tinyNoteSpacing);

        textarea.val(props.value).prop('readonly', (props.interactive === false));
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

    timeseries: (props, compId, appId) => {
        console.log(`Timeseries`, props, compId);
    },

    uploadbutton: (props, compId, appId) => {
        console.log(`UploadButton`, props, compId);
    },

    video: (props, compId, appId) => {
        console.log(`Video`, props, compId);
    },

    column: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('p-2').addClass('column');

        if (props.show_label && typeof props.label === 'string') {
            finalResult.append($('<div>', { id }).text(props.label));
        }

        return finalResult;

    },

    row: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('row');

        if (props.show_label && typeof props.label === 'string') {
            finalResult.append($('<div>', { id }).text(props.label));
        }

        return finalResult;

    },

    accordion: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('accordion');

        const collapseId = `${id}_collapse_${compId}`;

        if (typeof props.label === 'string') {

            const collapse = $('<div>', { class: 'collapse', id: collapseId });
            const button = $('<button>', {
                class: 'btn ic-btn ic-btn-link btn-bg btn-link btn-bg btn-text-link btn-bg',
                type: 'button',
                'data-bs-toggle': 'collapse',
                'aria-expanded': props.open ? 'true' : 'false',
                'aria-controls': collapseId,
                'data-bs-target': `#${collapseId}`
            }).text(props.label).append(
                $('<i>', { class: `collapse-button float-end ms-2 ic-base ic-fa ic-fa-normal fa-solid fa-caret-${props.open ? 'down' : 'left'}` })
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

    group: (props, compId, appId) => {

        const finalResult = displayOptions(props, compId, appId);
        const id = `gradio_${appId}${props.elem_id ? `_${props.elem_id}` : ''}`;
        finalResult.attr('id', id).addClass('group').addClass('my-3');

        if (props.show_label && typeof props.label === 'string') {
            finalResult.append($('<div>', { id }).text(props.label));
        }

        return finalResult;

    },

};

// Children
const childrenLoader = (items, config, url, appId) => {
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
                const component = config.components.find(c => c.id === items[item].id);

                // New Children
                if (existChildrens) newPage = childrenLoader(items[item].children, config, url, appId);

                // Componet
                if (objType(component, 'object') && objType(component.props, 'object') && typeof component.type === 'string' && (typeof components[component.type] === 'function' || component.type === 'form')) {

                    // Row and Accordion
                    if (existChildrens && (component.type === 'row' || component.type === 'accordion')) {

                        // Row
                        if (component.type === 'row') {

                            // Create Row Items
                            let newPageLength = 0;
                            newPage.forEach(item2 => {
                                if (item2.text().trim().length > 0 && !item2.hasClass('d-none')) newPageLength++;
                            });

                            // Get row list item
                            const rowItems = rowsList[newPageLength];

                            // Insert Row items
                            let rowItem = 0;
                            newPage.forEach(item2 => {
                                page.push($('<div>', { class: `col-md-${rowItems[rowItem]}${item2.hasClass('d-none') ? ' d-none' : ''}` }).append(item2));
                                if (rowItem > rowItems) rowItem = 0;
                            });

                        }

                    }

                    // Others
                    else {
                        page = newPage;
                    }

                    // Others
                    if (component.type !== 'form') {

                        // Get Component
                        const tinyHtml = components[component.type](component.props, component.id, appId, url);

                        // Fix Accordion
                        if (component.type === 'accordion') {
                            tinyHtml.find('.card .card-body .collapse').append(newPage);
                        }

                        // Check html data
                        if (typeof tinyHtml !== 'undefined') {
                            if (page) tinyHtml.append(page);
                            html.push(tinyHtml);
                        }

                    }

                    // Build Form Data
                    else if (page) {
                        page.forEach(item2 => {
                            component.props.app_id = appId;
                            item2.attr('form-component-id', component.id).attr('form-element-id', component.props.elem_id).data('gradio_form_data', component);
                            html.push(item2);
                        });
                    }

                }

            }
        }

        // Complete
        return html;

    }
};

export function getHtml(config, cssBase, url = '', appId = '') {
    if (
        objType(config, 'object') && objType(config.layout, 'object') &&
        Array.isArray(config.layout.children) && config.layout.children.length > 0 &&
        Array.isArray(config.components) && config.components.length > 0
    ) {

        // Get Children
        const page = childrenLoader(config.layout.children, config, url, appId);
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