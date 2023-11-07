
let tinyJson = {};

// Data
if (crdt.ydoc) {

    const jsonCache = crdt.ydoc.getText(id);

    try {
        tinyJson = JSON.parse(jsonCache.toString());
    } catch {
        tinyJson = {};
    }

    jsonCache.observe((event) => {
        try {
            tinyJson = JSON.parse(jsonCache.toString());
            console.log(event, tinyJson);
        } catch {
            tinyJson = {};
        }
    });

    console.log(tinyJson, jsonCache, config);

    /*
        Read Data

        config.components - find by id

        config.components[id].props
        Edit props


    */

    setTimeout(() => {
        // tinyJson.yay = 'yay';
        // jsonCache.insert(0, JSON.stringify(tinyJson))
    }, 10000);

    // array of numbers which produce a sum
    const yarray = crdt.ydoc.getArray("count");

    // observe changes of the sum
    yarray.observe(() => {
        // print updates when the data changes
        console.log(`new sum: ${yarray.toArray().reduce((a, b) => a + b)}`);
    });

}