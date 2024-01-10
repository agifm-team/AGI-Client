/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { selectRoomMode } from '../../../../src/client/action/navigation';
import { serverDomain } from '../../socket';
import ItemWelcome from './item';
import { ChatRoomFrame } from '../../../../src/app/embed/ChatRoom';
// import AgentCard from './AgentCard/AgentCard.jsx';
import './custom.scss';

/*
    <ChatRoomFrame roomId=`#imagegen:${serverDomain}` className='m-3 border border-bg' style={{ height: 300, width: 500 }} refreshTime={1} />
    This is the component that embeds the chat room.
*/

let connectionTestTimeout = false;

function Welcome() {

  // Data
  const [list, setList] = useState(null); // [data, setData
  const [tempSearch, setTempSearch] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  const [data, setRoomData] = useState(null); // room data
  const [dataTag, setSelectedTag] = useState(null);

  // Generator
  const categoryGenerator = (where, type, title, citem) => (
    <div className="category" id={`agi-home-${type}-${where}`}>
      <hr />

      <h5 className="title mt-2 mb-3 float-start">
        {title}
      </h5>
      <br className="clearfix" />
      <br />

      <div className="cover" />
      <ul className="list-group list-group-horizontal border-0">
        {citem.map((bot) => <ItemWelcome
          bot={bot}
          type={type}
          index={0}
          itemsLength={bot.length}
        />)}
      </ul>
    </div>
  );

  // handleSearch
  const handleSearchChange = (event) => {
    setTempSearch(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSelectedTag(tempSearch);
  };

  // Effect
  useEffect(() => {

    // Set Data
    if (data === null && !loadingData) {

      // Load Data
      setLoadingData(true);

      fetch(`https://bots.${serverDomain}/list`, {
        headers: {
          Accept: 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((newData) => {

          if (Array.isArray(newData)) {

            setList(newData[0]);
            setRoomData(newData[1]);
            // console.log('Fetched JSON:', newData);
            // console.log('List:', list)
            // console.log('Room Data:', data)

          } else {

            console.error(newData);
            setList(null);
            setRoomData(null);

          }

          setLoadingData(false);

        })
        .catch((err) => {
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

  const users = [];
  const rooms = [];

  if (!loadingData && Array.isArray(data)) {
    for (const item in data) {

      if (typeof data[item].room_id === 'string' && data[item].room_id !== 'Coming soon!') {
        rooms.push({
          id: data[item].room_id,
          description: data[item].meta.description,
          title: data[item].meta.title,
        });
      }

      if (typeof data[item].username === 'string' && data[item].username !== 'Coming soon!') {
        users.push({
          id: data[item].username,
          description: data[item].meta.description,
          title: data[item].meta.title,
        });
      }

    }
  }

  // Room
  console.log('data', data);
  console.log('dataTag', dataTag);
  console.log('users', users);
  console.log('rooms', rooms);

  // Result
  return <div className="tiny-welcome p-3 border-0 h-100 noselect px-5">
    <center className="py-1 w-100 px-3">
      <div id="menu" className="text-start">
        <button
          type="button"
          className="me-3 btn btn-primary rounded-pill "
        // onClick={() => history.goBack()}
        >
          <i className="fa-solid fa-left-long mr-2 btn-primary" />{" "}
          Rooms
        </button>
        <button
          type="button"
          className="me-5 btn btn-primary d-none "
          id="leave-welcome"
          onClick={() => selectRoomMode('navigation')}
        >
          <i className="fa-solid fa-left-long" />
        </button>
        <button
          type="button"
          className={`me-3 btn btn-primary${tinyType === 'enterprise' ? ' active' : ''} rounded-pill`}
          onClick={() => setTinyType('enterprise')}
        >
          Enterprise
        </button>
        <button
          type="button"
          className={`btn btn-primary${tinyType === 'community' ? ' active' : ''} rounded-pill`}
          onClick={() => setTinyType('community')}
        >
          Community
        </button>
      </div>
      <div className="row mt-2">
        <h3 className=' text-start'>Popular spaces </h3>
        <div className="col-md-6">
          <ChatRoomFrame
            roomId={`#imagegen:${serverDomain}`}
            className="border border-bg w-100"
            style={{ height: 300 }}
            refreshTime={1}
          />
        </div>

        <div className="col-md-6">
          <ChatRoomFrame
            roomId={`#previews:${serverDomain}`}
            className="border border-bg w-100"
            style={{ height: 300 }}
            refreshTime={1}
          />
        </div>
      </div>

      <form className="Formy" onSubmit={handleSearchSubmit}>
        <input
          className='btn btn-bg w-100 border my-3'
          type="text"
          value={tempSearch}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          placeholder="Search for bots and rooms..."
        />
      </form>
      <div className="taggy">
        <button
          className="btn taggyButton btn-bg very-small border"
          onClick={() => setSelectedTag(null)}
        >
          All
        </button>
        {list &&
          list.map((tag) => (
            <button
              className={`btn taggyButton btn-bg very-small border${typeof dataTag === 'string' && dataTag === tag ? ' active' : ''}`}
              key={tag}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
      </div>

      <div id="menu" className="text-start">
        <button
          type="button"
          className="me-3 btn btn-primary d-none"
          id="leave-welcome"
          onClick={() => selectRoomMode('navigation')}
        >
          <i className="fa-solid fa-left-long" />
        </button>
      </div>

      <hr />


      {/* 
      {!loadingData && data && Array.isArray(data.categories) ? (
        categories.map((citem) => (
          <>
            {categoryGenerator('popular_bots', 'bots', 'Bots', citem)}
            {categoryGenerator('popular_rooms', 'rooms', 'Rooms', citem)}
          </>
        ))
      ) : (
        <p className="placeholder-glow mt-5">
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
      )}

      {/* <div className="row mt-2">
          <div className="col-md-6">
            <ChatRoomFrame
              roomId={`#imagegen:${serverDomain}`}
              className="border border-bg w-100"
              style={{ height: 300 }}
              refreshTime={1}
            />
          </div>

          <div className="col-md-6">
            <ChatRoomFrame
              roomId={`#previews:${serverDomain}`}
              className="border border-bg w-100"
              style={{ height: 300 }}
              refreshTime={1}
            />
          </div>
        </div> */}
    </center>
  </div>;
}

export default Welcome;
