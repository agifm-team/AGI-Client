import { objType } from '../../../../src/util/tools';

// Components
const components = {



};

// Children
const childrenLoader = (items, app) => {
    if (Array.isArray(items)) {

        // HTML Items
        const html = [];

        // Read Data
        for (const item in items) {
            if (objType(items[item], 'object') && typeof items[item].id === 'number' && !Number.isNaN(items[item].id) && Number.isFinite(items[item].id)) {

                // Page Data
                let page;
                if (Array.isArray(items[item].children)) page = childrenLoader(items[item].children);

                // Componet
                const component = app.components.find(c => c.id === items[item].id);
                if ((objType(component, 'object') && typeof component.type === 'string' && typeof components[component.type] === 'function') || items[item].id === 0) {

                    let tinyHtml;

                    if (items[item].id !== 0) {
                        tinyHtml = components[component.type](component);
                    } else {
                        tinyHtml = $('<span>');
                    }

                    if (tinyHtml) {
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

export function getHtml(app) {
    if (objType(app.layout, 'object') && Array.isArray(app.components)) {

        // Get Children
        const page = childrenLoader([app.layout], app);

        // Complete
        return page;

    }
};