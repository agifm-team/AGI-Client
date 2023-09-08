import { objType } from '../../../../src/util/tools';

// Components
const components = {

    audio: (component) => {
        console.log(`Audio`, component);
    },

    barplot: (component) => {
        console.log(`BarPlot`, component);
    },

    button: (component) => {
        console.log(`Button`, component);
    },

    chatbot: (component) => {
        console.log(`Chatbot`, component);
    },

    checkbox: (component) => {
        console.log(`Checkbox`, component);
    },

    checkboxgroup: (component) => {
        console.log(`CheckboxGroup`, component);
    },

    clearbutton: (component) => {
        console.log(`ClearButton`, component);
    },

    code: (component) => {
        console.log(`Code`, component);
    },

    colorpicker: (component) => {
        console.log(`ColorPicker`, component);
    },

    dataframe: (component) => {
        console.log(`Dataframe`, component);
    },

    dataset: (component) => {
        console.log(`Dataset`, component);
    },

    dropdown: (component) => {
        console.log(`Dropdown`, component);
    },

    duplicatebutton: (component) => {
        console.log(`DuplicateButton`, component);
    },

    file: (component) => {
        console.log(`File`, component);
    },

    gallery: (component) => {
        console.log(`Gallery`, component);
    },

    html: (component) => {
        console.log(`HTML`, component);
    },

    highlightedtext: (component) => {
        console.log(`HighlightedText`, component);
    },

    image: (component) => {
        console.log(`Image`, component);
    },

    interpretation: (component) => {
        console.log(`Interpretation`, component);
    },

    json: (component) => {
        console.log(`JSON`, component);
    },

    label: (component) => {
        console.log(`Label`, component);
    },

    lineplot: (component) => {
        console.log(`LinePlot`, component);
    },

    loginbutton: (component) => {
        console.log(`LoginButton`, component);
    },

    logoutbutton: (component) => {
        console.log(`LogoutButton`, component);
    },

    markdown: (component) => {
        console.log(`Markdown`, component);
    },

    model3d: (component) => {
        console.log(`Model3D`, component);
    },

    number: (component) => {
        console.log(`Number`, component);
    },

    plot: (component) => {
        console.log(`Plot`, component);
    },

    radio: (component) => {
        console.log(`Radio`, component);
    },

    scatterplot: (component) => {
        console.log(`ScatterPlot`, component);
    },

    slider: (component) => {
        console.log(`Slider`, component);
    },

    state: (component) => {
        console.log(`State`, component);
    },

    textbox: (component) => {
        console.log(`Textbox`, component);
    },

    timeseries: (component) => {
        console.log(`Timeseries`, component);
    },

    uploadbutton: (component) => {
        console.log(`UploadButton`, component);
    },

    video: (component) => {
        console.log(`Video`, component);
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
                if (objType(component, 'object') && typeof component.type === 'string' && typeof components[component.type] === 'function') {
                    const tinyHtml = components[component.type](component);
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