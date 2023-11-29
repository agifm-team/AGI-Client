/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { selectRoomMode } from '../../../../src/client/action/navigation';
import defaultAvatar from '../../../../src/app/atoms/avatar/defaultAvatar';
import { serverAddress } from '../../socket';
import ItemWelcome from './item';

let connectionTestTimeout = false;

let selected = null;
const apiAddress = `${serverAddress}`;
function Welcome() {

    // Data
    const [tinyType, setTinyType] = useState('community');
    const [data, setData] = useState(null);
    const [loadingData, setLoadingData] = useState(false);

    const selectJson = (newData) => {

        selected = tinyType;

        if (newData.data) setData(newData.data);
        else {

            console.error(newData);
            if (newData?.message) {
                alert(`Agi-Mod - ${newData.message}`);
                console.error(newData.message);
            } else {
                alert(`Agi-Mod - ${newData.detail}`);
                console.error(newData.detail);
            }

            console.error(newData?.status);

            setData({});

        }

        setLoadingData(false);

    };

    // Effect
    useEffect(() => {

        // Set Data
        if ((selected !== tinyType || !data) && !loadingData) {

            // Load Data
            setLoadingData(true);
            fetch(`${apiAddress}get_list/${tinyType}`, {
                headers: {
                    'Accept': 'application/json'
                }
            }).then(res => res.json()).then(selectJson).catch(err => {

                console.error(err);
                alert(err.message);

                if (!connectionTestTimeout) {
                    connectionTestTimeout = true;
                    setTimeout(() => {
                        setLoadingData(false);
                    }, 3000);
                }

            });

        }

    });

    // Items
    const items = [];
    for (let i = 0; i < 10; i++) {
        items.push({
            index: i,
            id: i,
            avatar: defaultAvatar(1),
            title: `Item ${i + 1}`,
            desc: 'This is a tiny test to make more tiny tests with some random stuff.'
        });
    }

    // Categories
    const categories = [];
    if (data && Array.isArray(data.category_keys)) {
        for (const item in data.category_keys) {
            categories.push({
                name: typeof data.category_keys[item] === 'string' ? data.category_keys[item] : '',
                id: tinyType
            });
        }
    }

    // Generator
    const categoryGenerator = (where, type, title, citem) => <div className='category' id={`agi-home-${citem.id}-${where}`}>

        <hr />

        <h5 className='title mt-2 mb-3 float-start'>{title} - {citem.name}</h5>
        <h6 className='see-all mt-2 mb-3 float-end'>See all</h6>
        <br className='clearfix' />
        <br />

        <div className='cover' />
        <ul className='list-group list-group-horizontal border-0' >
            {data.categories.map((item) => item ? item[where].map((bot) => <ItemWelcome bot={bot} type={type} item={item} title={title} itemsLength={items.length} />) : null)}
        </ul>

    </div>;

    // Result
    return <div className="tiny-welcome p-3 border-0 h-100 noselect px-5" style={{ alignItems: 'center' }}>
        <center className='py-5 w-100 px-5'>

            <div id='menu' className='text-start'>
                <button type="button" className='me-3 btn btn-primary d-none' id='leave-welcome' onClick={() => selectRoomMode('navigation')}><i class="fa-solid fa-left-long" /></button>
                <button type="button" className={`me-3 btn btn-primary${tinyType === 'enterprise' ? ' active' : ''}`} onClick={() => setTinyType('enterprise')}>Enterprise</button>
                <button type="button" className={`btn btn-primary${tinyType === 'community' ? ' active' : ''}`} onClick={() => setTinyType('community')}>Community</button>
            </div>

            {!loadingData && data && Array.isArray(data.categories) ?
                categories.map((citem) => <>
                    {categoryGenerator('popular_bots', 'bots', 'Bots', citem)}
                    {categoryGenerator('popular_rooms', 'rooms', 'Rooms', citem)}
                </>)
                : <p className="placeholder-glow mt-5">
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                    <span className="placeholder col-12" />
                </p>
            }

        </center>
    </div>;

}

export default Welcome;
