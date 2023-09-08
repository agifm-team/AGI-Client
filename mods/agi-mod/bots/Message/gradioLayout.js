import { objType } from '../../../../src/util/tools';

// Components
const components = {



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