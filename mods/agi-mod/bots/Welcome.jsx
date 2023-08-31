import React from 'react';

import defaultAvatar from '../../../src/app/atoms/avatar/defaultAvatar';

const serverAddress = 'http://54.219.82.132:5000/';

function Welcome() {

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
    const categories = [
        { name: 'Popular bots', id: 'popular-bots' },
        { name: 'New bots', id: 'new-bots' }
    ];

    return <div className="tiny-welcome p-3 border-0 h-100 noselect px-5" style={{ alignItems: 'center' }}>
        <center className='py-5 w-100 px-5'>

            <div id='menu' class="row">

                <div class="col-sm-6 mb-3 mb-sm-0">
                    <div class="card">
                        <div class="card-body">

                            <h5 class="card-title fw-bold text-uppercase">Enterprise</h5>
                            <p class="card-text">AI Agents for Teams</p>

                        </div>
                    </div>
                </div>

                <div class="col-sm-6">
                    <div class="card">
                        <div class="card-body">

                            <h5 class="card-title fw-bold text-uppercase">Community</h5>
                            <p class="card-text">AI Agents for Fun and Productivity</p>

                        </div>
                    </div>
                </div>

            </div>

            <input type="text" className="form-control form-control-bg mt-5" />

            {categories.map((citem) => <div className='my-5 category' id={`agi-home-${citem.id}`}>

                <h5 className='title mt-2 mb-3 float-start'>{citem.name}</h5>
                <h6 className='see-all mt-2 mb-3 float-end'>See all</h6>
                <br className='clearfix' />
                <br />

                <div className='cover' />
                <ul className='list-group list-group-horizontal border-0' >
                    {items.map((item) => <li className={`list-group-item border border-bg m${item.index > 0 ? item.index < items.length - 1 ? 'x-3' : 's-3' : 'e-3'}`} id={`agi-home-item-${item.id}`}>

                        <img className='img-fluid avatar' alt='avatar' src={item.avatar} />
                        <h5 class="card-title text-bg">{item.title}</h5>
                        <p class="card-text text-bg-low">{item.desc}</p>

                    </li>)}
                </ul>

            </div>)}

        </center>
    </div>;

}

export default Welcome;
