/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import clone from 'clone';

import { insertAgiAvatar } from '@mods/agi-mod/lib';
// import initMatrix from '@src/client/initMatrix';
import { objType } from 'for-promise/utils/lib.mjs';
import { selectRoomMode } from '@src/client/action/navigation';
import Button from '@src/app/atoms/button/Button';
import { rca } from '@src/util/libs/rainbowText';
import { shuffleArray } from '@src/util/tools';
// import { ChatRoomFrame } from '@src/app/embed/ChatRoom';

import { serverDomain } from '../../socket';
import ItemWelcome from './item';
// import AgentCard from './AgentCard/AgentCard.jsx';
import './custom.scss';
import './logo.scss';

/*
    <ChatRoomFrame roomId=`#imagegen:${serverDomain}` hsUrl={isGuest && `https://matrix.${serverDomain}`} className='m-3 border border-bg' refreshTime={1} />
    This is the component that embeds the chat room.
*/

let connectionTestTimeout = false;

// Rainbow Border Apply
const rainbowBorder = (chatroom, dreg = 124) => {
  chatroom.each((index, value) => {
    $(value).attr(
      'style',
      `border-image: linear-gradient(
      ${String(dreg)}deg,
      #ff2400,
      #e81d1d,
      #e8b71d,
      #e3e81d,
      #1de840,
      #1ddde8,
      #2b1de8,
      #dd00f3,
      #dd00f3
    )
    1 !important`,
    );
  });
};

// Generator
const CategoryGenerator = ({ type, title, citem, isGuest, setSelectedTag }) => {
  const firstLimit = 3;
  const notUsingLimit = citem.length < firstLimit;
  const [isLimited, setIsLimited] = useState(true);
  const [limitAmount, setLimitAmount] = useState(notUsingLimit ? citem.length : firstLimit);
  let limitCounter = 0;

  return (
    <>
      <hr />
      <h5 className="title mt-2 mb-3 h2">{title}</h5>
      <br />

      <div className={`row welcome-card${isGuest ? ' guest' : ''}`}>
        {citem.map((bot) => {
          if (limitCounter < limitAmount || !isLimited) {
            limitCounter++;
            return (
              <ItemWelcome
                setSelectedTag={setSelectedTag}
                isGuest={isGuest}
                bot={bot}
                type={type}
                index={0}
                itemsLength={bot.length}
              />
            );
          }
        })}
      </div>

      {!notUsingLimit && isLimited ? (
        <Button variant="primary" size="lg" onClick={() => setIsLimited(false)}>
          Show more
        </Button>
      ) : null}
    </>
  );
};

function Welcome({ isGuest }) {
  // Data
  const [categories, setCategories] = useState(null); // [data, setData
  const [list, setList] = useState(null); // [data, setData
  const [tempSearch, setTempSearch] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  const [data, setRoomData] = useState(null); // room data
  const [dataTag, setSelectedTag] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('fun');

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
    let botListUpdate;
    // Set Data
    if (data === null && !loadingData) {
      // Load Data
      setLoadingData(true);

      // Loading Bot list
      const loadingFetch = () => {
        const fetchJSON = (url) =>
          new Promise((resolve, reject) => {
            fetch(url, {
              headers: {
                Accept: 'application/json',
              },
            })
              // Check network
              .then((res) => {
                if (!res.ok) {
                  throw new Error('Network response was not ok');
                }
                return res.json();
              })
              .then(resolve)
              .catch(reject);
          });

        const tinyError = (err) => {
          console.error(err);
          alert(err.message);

          if (!connectionTestTimeout) {
            connectionTestTimeout = true;
            setTimeout(() => {
              setLoadingData(false);
            }, 3000);
          }
        };

        fetchJSON(`https://bots.${serverDomain}/botlist`)
          .then((botList) => {
            fetchJSON(`https://bots.${serverDomain}/public`)
              .then((publix) => {
                // is Array
                if (Array.isArray(botList) && Array.isArray(publix)) {
                  // Prepare data
                  const rooms = [];
                  const listTags = [];
                  const listCategories = [];

                  const insertData = (item, where) => {
                    // Is Object
                    if (objType(where[item], 'object')) {
                      // Get Tags
                      if (Array.isArray(where[item].tags)) {
                        for (const item2 in where[item].tags) {
                          if (
                            typeof where[item].tags[item2] === 'string' &&
                            listTags.indexOf(where[item].tags[item2]) < 0
                          ) {
                            listTags.push(where[item].tags[item2]);
                          }
                        }
                      }

                      // Get Category
                      if (
                        typeof where[item].category === 'string' &&
                        listCategories.indexOf(where[item].category) < 0
                      ) {
                        listCategories.push(where[item].category);
                      }

                      // Insert rooms
                      rooms.push(where[item]);
                    }
                  };

                  // Get Data
                  for (const item in botList) {
                    insertData(item, botList);
                  }
                  for (const item in publix) {
                    insertData(item, publix);
                  }

                  // Set data
                  setCategories(listCategories);
                  setList(listTags);
                  setRoomData(rooms);
                }

                // Error
                else {
                  console.error(botList);
                  setCategories(null);
                  setList(null);
                  setRoomData(null);
                }

                setLoadingData(false);
              })

              // Error
              .catch(tinyError);
          })
          .catch(tinyError);
      };

      // Execute script
      loadingFetch();
      botListUpdate = setInterval(() => botListUpdate(), 60000);
    }

    // Rainbow
    const chatroom = $('.tiny-welcome #chatrooms .chatroom');
    let rainbowPosition = 124;
    const intervalChatRoom = setInterval(() => {
      rainbowBorder(chatroom, rainbowPosition);
      rainbowPosition += rainbowPosition > 20 && rainbowPosition < 320 ? 1 : 0.2;
      if (rainbowPosition > 360) rainbowPosition = 0;
    }, 12);

    rainbowBorder(chatroom, rainbowPosition);

    // Complete
    return () => {
      clearInterval(intervalChatRoom);
      if (botListUpdate) clearInterval(botListUpdate);
    };
  });

  // Final data prepare
  const users = [];
  const rooms = [];
  const spaces = [];

  // Read data
  if (!loadingData && Array.isArray(data)) {
    for (const item in data) {
      if (
        // Category
        (typeof data[item].category !== 'string' ||
          typeof selectedCategory !== 'string' ||
          data[item].category === selectedCategory) &&
        // Tags
        (!Array.isArray(data[item].tags) ||
          (typeof dataTag === 'string' && data[item].tags.indexOf(dataTag) > -1) ||
          dataTag === null)
      ) {
        // Room base data
        const roomData = {
          agiId: data[item].id,
          description: data[item].desc || data[item].description,
          title: data[item].name || '???',
          tags: data[item].tags || [],
          category: data[item].category || '',
        };

        // Get avatar
        try {
          roomData.avatar = insertAgiAvatar(data[item], null);
        } catch (err) {
          console.error(err);
          roomData.avatar = null;
        }

        // Is Room
        if (typeof data[item].room_id === 'string') {
          const newRoomData = clone(roomData);
          newRoomData.id = data[item].room_id;
          rooms.push(newRoomData);
        }

        // Is Space
        if (typeof data[item].space_id === 'string') {
          const newRoomData = clone(roomData);
          newRoomData.id = data[item].space_id;
          spaces.push(newRoomData);
        }

        // Is Bot
        if (typeof data[item].bot_username === 'string') {
          const newRoomData = clone(roomData);
          newRoomData.id = data[item].bot_username;
          users.push(newRoomData);
        }
      }
    }
  }

  /*
  <div className="row mt-2" id="chatrooms">
          <div className="col-md-6">
            <ChatRoomFrame
              hsUrl={isGuest && `https://matrix.${serverDomain}`}
              roomId={`#gemini-chat:${serverDomain}`}
              className="border border-bg w-100 chatroom"
              refreshTime={1}
            />
          </div>

          <div className="col-md-6">
            <ChatRoomFrame
              hsUrl={isGuest && `https://matrix.${serverDomain}`}
              roomId={`#gpt-4:${serverDomain}`}
              className="border border-bg w-100 chatroom"
              refreshTime={1}
            />
          </div>
        </div>
  */

  const rainbowData = shuffleArray(rca(24, 'hex'));
  let color = 1;

  // Result
  return (
    <div className={`tiny-welcome border-0 h-100 noselect${isGuest ? ' is-guest' : ''}`}>
      {
        <center className="w-100">
          <div
            id="welcome-carousel"
            className="py-4 mx-4 carousel slide rounded-carousel"
            data-bs-ride="true"
          >
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#welcome-carousel"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              />
              <button
                type="button"
                data-bs-target="#welcome-carousel"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              />
              <button
                type="button"
                data-bs-target="#welcome-carousel"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              />
            </div>

            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="./img/homepage-slider/c1.gif"
                  className="d-block w-100"
                  draggable="false"
                  alt="..."
                />
                <div className="carousel-caption">
                  <h5>Pixxel Forge</h5>
                  <p>
                    Create Ai Pixxels, customizing their personality, appearance, and knowledge
                    domains
                  </p>
                </div>
              </div>

              <div className="carousel-item">
                <img
                  src="./img/homepage-slider/c2.gif"
                  className="d-block w-100"
                  draggable="false"
                  alt="..."
                />
                <div className="carousel-caption">
                  <h5>Fantastical Tools</h5>
                  <p>
                    Embed specialized AI tools for visuals, sound, coding, writing – the limit is
                    the imagination of the Pixxels community
                  </p>
                </div>
              </div>

              <div className="carousel-item">
                <img
                  src="./img/homepage-slider/c3.gif"
                  className="d-block w-100"
                  draggable="false"
                  alt="..."
                />
                <div className="carousel-caption">
                  <h5>Pixxel Spaces</h5>
                  <p>
                    Whimsical virtual spaces where users collaborate with both human teams and their
                    individual Pixxels
                  </p>
                </div>
              </div>
            </div>

            <button
              className="carousel-control-prev d-none"
              type="button"
              data-bs-target="#welcome-carousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next d-none"
              type="button"
              data-bs-target="#welcome-carousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </center>
      }
      <center className={`py-4 px-4 w-100${isGuest ? ' mb-5' : ''}`}>
        <div id="menu" className={`text-start${isGuest ? ' is-guest' : ''}`}>
          {!isGuest ? (
            <button
              type="button"
              className="me-3 btn btn-primary d-none"
              id="leave-welcome"
              onClick={() => selectRoomMode('navigation')}
            >
              <i className="fa-solid fa-left-long" />
            </button>
          ) : null}

          <center className="logo-page">AI Pixxels</center>
        </div>

        <center className="taggy taggy2 taggy3">
          {categories && (
            <>
              {categories.map((tag) => (
                <button
                  className={`btn taggyButton btn-bg btn-lg ${typeof selectedCategory === 'string' && selectedCategory === tag ? ' active' : ''} text-uppercase`}
                  key={tag}
                  onClick={() => setSelectedCategory(tag)}
                >
                  {tag}
                </button>
              ))}
            </>
          )}
        </center>

        <div id="search-title">
          <div className="search-info mb-3">
            <form className="search-form mb-2 mt-3" onSubmit={handleSearchSubmit}>
              <input
                className="search-input btn btn-bg w-100 border"
                type="text"
                value={tempSearch}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
                placeholder="Search or Create custom AI-Pixxels ..."
              />
            </form>
          </div>
        </div>

        <center className="taggy taggy2">
          {list && (
            <>
              <button
                className={`btn taggyButton very-small ${dataTag === null ? ' active' : ''} text-lowercase`}
                key="CLEAR_ALL"
                style={{
                  color: `#${rainbowData[0].hex}`,
                  border: `var(--bs-border-width) var(--bs-border-style) #${rainbowData[0].hex}`,
                }}
                onClick={() => setSelectedTag(null)}
              >
                all
              </button>

              {list.map((tag) => {
                if (!rainbowData[color]) color = 0;
                const tinyColor = rainbowData[color].hex;
                color++;

                return (
                  <button
                    className={`btn taggyButton very-small ${typeof dataTag === 'string' && dataTag === tag ? ' active' : ''} text-lowercase`}
                    style={{
                      color: `#${tinyColor}`,
                      borderColor: `var(--bs-border-width) var(--bs-border-style) #${tinyColor}`,
                    }}
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </>
          )}
        </center>

        {!loadingData ? (
          <>
            {users.length > 0 ? (
              <CategoryGenerator
                isGuest={isGuest}
                setSelectedTag={setSelectedTag}
                type="bots"
                title="Bots"
                citem={users}
              />
            ) : null}
            {rooms.length > 0 ? (
              <CategoryGenerator
                isGuest={isGuest}
                setSelectedTag={setSelectedTag}
                type="rooms"
                title="Rooms"
                citem={rooms}
              />
            ) : null}
            {spaces.length > 0 ? (
              <CategoryGenerator
                isGuest={isGuest}
                setSelectedTag={setSelectedTag}
                type="spaces"
                title="Spaces"
                citem={spaces}
              />
            ) : null}
          </>
        ) : (
          <>
            <hr />
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
          </>
        )}
      </center>
    </div>
  );
}

export default Welcome;
