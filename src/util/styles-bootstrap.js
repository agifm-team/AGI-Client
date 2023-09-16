const bootstrapItems = {

    normal: [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
    ],

    outline: [
        'outline-primary',
        'outline-secondary',
        'outline-success',
        'outline-danger',
        'outline-warning',
        'outline-info',
        'outline-light',
        'outline-dark'
    ]

};

const arrayItems = [

    'bg',
    'bg2',

    'outline-bg',
    'outline-bg2',

    'link',
    'link btn-bg',

];

for (const where in bootstrapItems) {
    for (const item in bootstrapItems[where]) {
        arrayItems.push(bootstrapItems[where][item]);
    }
}

export { arrayItems, bootstrapItems };