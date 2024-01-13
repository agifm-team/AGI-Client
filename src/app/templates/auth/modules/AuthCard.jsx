import React, { useState } from 'react';

import Homeserver from './Homeserver';
import Login from './Login';
import Register from './Register';

global.authPublicData = {};
function AuthCard() {
    const [hsConfig, setHsConfig] = useState(null);

    const handleHsChange = (info) => {
        setHsConfig(info);
    };

    global.authPublicData.register = { params: hsConfig?.register?.params };

    return (<>

        <div className='mb-4'>
            <Homeserver onChange={handleHsChange} />
        </div>

        {hsConfig !== null && (
            <Login loginFlow={hsConfig.login.flows} baseUrl={hsConfig.baseUrl} />
        )}

    </>);
}

export default AuthCard;