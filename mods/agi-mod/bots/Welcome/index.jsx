/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { selectRoomMode } from '../../../../src/client/action/navigation';
import defaultAvatar from '../../../../src/app/atoms/avatar/defaultAvatar';
import { serverAddress } from '../../socket';
import ItemWelcome from './item';
import { ChatRoomFrame } from '../../../../src/app/embed/ChatRoom';
import AgentCard from './AgentCard/AgentCard.jsx';
import './custom.scss';
/*
    <ChatRoomFrame roomId='#imagegen:agispace.co' className='m-3 border border-bg' style={{ height: 300, width: 500 }} refreshTime={1} />
    This is the component that embeds the chat room.
*/

let connectionTestTimeout = false;

let selected = null;
const apiAddress = `${serverAddress}`;

function Welcome() {
  // Data
  const [tinyType, setTinyType] = useState('community');
  const [data, setData] = useState(null);
  const [list, setList] = useState(null); // [data, setData
  const [roomData, setRoomData] = useState(null); // room data
  const [tempSearch, setTempSearch] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
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

  const fetchJson = () => {
    fetch('https://bots.agispace.co/list')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((newData) => {
        setList(newData[0]);
        setRoomData(newData[1]);
        // console.log('Fetched JSON:', newData);
        // console.log('List:', list)
        // console.log('Room Data:', roomData)
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  };
  // Effect
  useEffect(() => {
    fetchJson();
    // Set Data
    if ((selected !== tinyType || !data) && !loadingData) {
      // Load Data
      setLoadingData(true);
      fetch(`${apiAddress}get_list/${tinyType}`, {
        headers: {
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .then(selectJson)
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
  }, []);

  // Items
  const items = [];
  for (let i = 0; i < 10; i++) {
    items.push({
      index: i,
      id: i,
      avatar: defaultAvatar(1),
      title: `Item ${i + 1}`,
      desc: 'This is a tiny test to make more tiny tests with some random stuff.',
    });
  }

  // Categories
  const categories = [];
  if (data && Array.isArray(data.category_keys)) {
    for (const item in data.category_keys) {
      categories.push({
        name: typeof data.category_keys[item] === 'string' ? data.category_keys[item] : '',
        id: tinyType,
      });
    }
  }

  // Generator
  const categoryGenerator = (where, type, title, citem) => (
    <div className="category" id={`agi-home-${citem.id}-${where}`}>
      <hr />

      <h5 className="title mt-2 mb-3 float-start">
        {title} - {citem.name}
      </h5>
      <h6 className="see-all mt-2 mb-3 float-end">See all</h6>
      <br className="clearfix" />
      <br />

      <div className="cover" />
      <ul className="list-group list-group-horizontal border-0">
        {data.categories.map((item) =>
          item
            ? item[where].map((bot) => (
              <ItemWelcome
                bot={bot}
                type={type}
                item={item}
                title={title}
                itemsLength={items.length}
              />
            ))
            : null
        )}
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
  // Room

  // Result
  return (
    <div className="tiny-welcome p-3 border-0 h-100 noselect px-5" style={{ alignItems: 'center' }}>
      <center className="py-5 w-100 px-5">
        <div className="row mt-2">
          <div className="col-md-6">
            <ChatRoomFrame
              roomId="#imagegen:agispace.co"
              className="border border-bg w-100"
              style={{ height: 300 }}
              refreshTime={1}
            />
          </div>

          <div className="col-md-6">
            <ChatRoomFrame
              roomId="#previews:agispace.co"
              className="border border-bg w-100"
              style={{ height: 300 }}
              refreshTime={1}
            />
          </div>
        </div>
        <form className="Formy" onSubmit={handleSearchSubmit}>
          <input
            className='btn btn-bg w-100 border'
            type="text"
            value={tempSearch}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
            placeholder="Search for bots and rooms..."
          />
        </form>
        <div className="taggy">
          {list &&
            list.map((tag) => (
              <button
                className="btn taggyButton btn-bg very-small border"
                key={tag}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
        </div>
        <h1 style={{ textAlign: 'left' }}>Bots</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap' }} className="bots">
          {roomData &&
            roomData
              .filter((room) =>
                selectedTag
                  ? room.meta.tags.includes(selectedTag) ||
                  room.username.toLowerCase().includes(selectedTag.toLowerCase())
                  : true
              )
              .map((room) => <AgentCard agent={room} key={room.id} Img={defaultAvatar(1)} />)}
        </div>
        <h1 style={{ textAlign: 'left' }}>Rooms</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }} className="bots">
          {roomData &&
            roomData
              .filter((room) =>
                selectedTag
                  ? room.meta.tags.includes(selectedTag) ||
                  room.username.toLowerCase().includes(selectedTag.toLowerCase())
                  : true
              )
              .map((room) => <AgentCard agent={room} key={room.id} Img={defaultAvatar(1)} />)}
        </div>
        {/*         <div id="menu" className="text-start">
          <button
            type="button"
            className="me-3 btn btn-primary d-none"
            id="leave-welcome"
            onClick={() => selectRoomMode('navigation')}
          >
            <i className="fa-solid fa-left-long" />
          </button>
          <button
            type="button"
            className={`me-3 btn btn-primary${tinyType === 'enterprise' ? ' active' : ''}`}
            onClick={() => setTinyType('enterprise')}
          >
            Enterprise
          </button>
          <button
            type="button"
            className={`btn btn-primary${tinyType === 'community' ? ' active' : ''}`}
            onClick={() => setTinyType('community')}
          >
            Community
          </button>
        </div>

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

        <hr />
 */}
        {/* <div className="row mt-2">
          <div className="col-md-6">
            <ChatRoomFrame
              roomId="#imagegen:agispace.co"
              className="border border-bg w-100"
              style={{ height: 300 }}
              refreshTime={1}
            />
          </div>

          <div className="col-md-6">
            <ChatRoomFrame
              roomId="#previews:agispace.co"
              className="border border-bg w-100"
              style={{ height: 300 }}
              refreshTime={1}
            />
          </div>
        </div> */}
      </center>
    </div>
  );
}

export default Welcome;
