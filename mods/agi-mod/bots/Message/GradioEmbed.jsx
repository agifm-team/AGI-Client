import React, { useRef, useEffect } from 'react';

if ($('head').find('#gradio-api').length < 1) {
    $('head').append($('<script>', { src: 'https://gradio.s3-us-west-2.amazonaws.com/3.42.0/gradio.js', id: 'gradio-api', type: 'module' }))
}

function GradioEmbed({ agiData }) {

    const embedRef = useRef(null);

    useEffect(() => {
        const embed = embedRef.current;
        if (embedRef.current) {

            console.log(embedRef.current);
            const embedMessage = (event) => {
                console.log('yay! Gradio!');
                console.log(event);
            };

            const embedMessage2 = (event) => {
                console.log('yay! Gradio 2!');
                console.log(event);
            };

            embed.addEventListener('render', embedMessage);
            embed.addEventListener('message', embedMessage2);
            return () => {
                embed.removeEventListener('render', embedMessage);
                embed.removeEventListener('message', embedMessage2);
            };

        }
    });

    return <div className='mt-2 ratio ratio-16x9 embed-video enabled agi-client-embed'>
        <gradio-app ref={embedRef} src={agiData.url} />
    </div>;

};

export default GradioEmbed;