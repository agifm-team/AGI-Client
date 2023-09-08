// Don touch here now!

// Read Template
const readTemplate = (items, existName) => {
    for (const item in items) {

        // Params
        if (Array.isArray(items[item].parameters) && items[item].parameters.length > 0) {
            for (const index in items[item].parameters) {

            }
        }

        // Return
        if (Array.isArray(items[item].returns) && items[item].returns.length > 0) {
            for (const index in items[item].returns) {

            }
        }

        if (objType(items[item].type, 'object')) {

        }

    }
};

// Start Template
readTemplate(appInfo.named_endpoints, true);
readTemplate(appInfo.unnamed_endpoints, false);


/*
 else if (!appInfo) {
    app.view_api().then(newInfo => setAppInfo(newInfo)).catch(tinyError);
}
*/