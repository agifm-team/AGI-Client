import React, { useRef, useEffect } from 'react';

function GradioEmbed({ agiData }) {

    const embedRef = useRef(null);

    useEffect(() => {

        const embed = $(embedRef.current);

    });

    return <div ref={embedRef} className='mt-2 ratio ratio-16x9 embed-video enabled agi-client-embed'>
        <embed className='webkit-scrollbar-thumb' title='Agi-Client' src={agiData.url} />
    </div>;

};

export default GradioEmbed;