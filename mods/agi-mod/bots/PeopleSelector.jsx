import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import defaultAvatar from '../../../src/app/atoms/avatar/defaultAvatar';

function PeopleSelector({ avatarSrc, avatarAnimSrc, name, color, peopleRole, onClick, user, disableStatus }) {
    return <div className="card">
        <div className='text-start my-3 mx-4'><img src={defaultAvatar(1)} className="img-fluid avatar rounded-circle" height={100} width={100} alt="avatar" /></div>
        <div className="text-start card-body mt-0 pt-0">
            <h5 className="card-title small text-bg">Tiny Item</h5>
            <p className="card-text very-small text-bg-low">This is a tiny test to make more tiny tests with some random stuff.</p>
        </div>
    </div>
}

PeopleSelector.defaultProps = {
    avatarAnimSrc: null,
    avatarSrc: null,
    peopleRole: null,
    user: null,
    disableStatus: false,
};

PeopleSelector.propTypes = {
    disableStatus: PropTypes.bool,
    user: PropTypes.object,
    avatarAnimSrc: PropTypes.string,
    avatarSrc: PropTypes.string,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    peopleRole: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default PeopleSelector;
