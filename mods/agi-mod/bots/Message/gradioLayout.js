import { objType } from '../../../../src/util/tools';

// Children
const childrenLoader = (item) => {
    if (objType(item)) {



    }
};

export function getHtml(app) {

    // Get Children
    const page = childrenLoader(app.layout);

    // Complete
    return page;

};