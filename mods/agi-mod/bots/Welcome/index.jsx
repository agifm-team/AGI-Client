import React, { useEffect, useState } from 'react';

import defaultAvatar from '../../../../src/app/atoms/avatar/defaultAvatar';
import { serverAddress } from '../../socket';
import ItemWelcome from './item';

let connectionTestTimeout = false;

let selected = null;
const apiAddress = `${serverAddress}api/v1/`;
function Welcome() {

    // Data
    const [tinyType, setTinyType] = useState('community');
    const [data, setData] = useState(null);
    const [loadingData, setLoadingData] = useState(false);

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
            }).then(res => res.json()).then((newData) => {

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

            }).catch(err => {

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

    return <div className="tiny-welcome p-3 border-0 h-100 noselect px-5" style={{ alignItems: 'center' }}>
        <center className='py-5 w-100 px-5'>

            <div id='menu' className="row">

                <div className="col-sm-6 mb-3 mb-sm-0">
                    <div className={`card${tinyType === 'enterprise' ? ' active' : ''}`} onClick={() => setTinyType('enterprise')}>
                        <div className="card-body">

                            <h5 className="card-title fw-bold text-uppercase">Enterprise</h5>
                            <p className="card-text">AI Agents for Teams</p>

                        </div>
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className={`card${tinyType === 'community' ? ' active' : ''}`} onClick={() => setTinyType('community')}>
                        <div className="card-body">

                            <h5 className="card-title fw-bold text-uppercase">Community</h5>
                            <p className="card-text">AI Agents for Fun and Productivity</p>

                        </div>
                    </div>
                </div>

            </div>

            <input type="text" className="form-control form-control-bg mt-5 text-center" />

            {!loadingData && data && Array.isArray(data.categories) ?
                categories.map((citem) => <div className='my-5 category' id={`agi-home-${citem.id}`}>

                    <h5 className='title mt-2 mb-3 float-start'>{citem.name}</h5>
                    <h6 className='see-all mt-2 mb-3 float-end'>See all</h6>
                    <br className='clearfix' />
                    <br />

                    <div className='cover' />
                    <ul className='list-group list-group-horizontal border-0' >
                        {data.categories.map((item) => item?.popular_bots.map((bot) => <ItemWelcome bot={bot} item={item} itemsLength={items.length} />))}
                    </ul>

                </div>)
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
