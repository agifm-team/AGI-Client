/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import clone from 'clone';

import { insertAgiAvatar } from '@mods/agi-mod/lib';
// import initMatrix from '@src/client/initMatrix';
import { objType } from '@src/util/tools';
import { selectRoomMode } from '@src/client/action/navigation';
// import { ChatRoomFrame } from '@src/app/embed/ChatRoom';

import { serverDomain } from '../../socket';
import ItemWelcome from './item';
// import AgentCard from './AgentCard/AgentCard.jsx';
import './custom.scss';

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

function Welcome({ isGuest }) {
  // Data
  const [list, setList] = useState(null); // [data, setData
  const [tempSearch, setTempSearch] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  const [data, setRoomData] = useState(null); // room data
  const [dataTag, setSelectedTag] = useState(null);
  const morphic = useRef(null);

  // Generator
  const categoryGenerator = (where, type, title, citem) => (
    <>
      <hr />
      <h5 className="title mt-2 mb-3">{title}</h5>
      <br />

      <div className={`row welcome-card${isGuest ? ' guest' : ''}`}>
        {citem.map((bot) => (
          <ItemWelcome
            setSelectedTag={setSelectedTag}
            isGuest={isGuest}
            bot={bot}
            type={type}
            index={0}
            itemsLength={bot.length}
          />
        ))}
      </div>
    </>
  );

  // handleSearch
  const handleSearchChange = (event) => {
    setTempSearch(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSelectedTag(tempSearch);
  };

  // Iframe block issue
  /* useEffect(() => {
    if (morphic.current) {
      const tinyMorphicUpdate = setInterval(() => {
        if (morphic.current && morphic.current.contentWindow) {
          // console.log(morphic.current.contentWindow.document);
          // const morRef = $(morphic.current.contentWindow);
          // console.log(morRef.height());
        }
      }, 100);
      return () => {
        clearInterval(tinyMorphicUpdate);
      };
    }
  }); */

  // Effect
  useEffect(() => {
    let botListUpdate;
    // Set Data
    if (data === null && !loadingData) {
      // Load Data
      setLoadingData(true);

      const loadingFetch = () => {
        fetch(`https://bots.${serverDomain}/botlist`, {
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
              const rooms = [];
              const listTags = [];

              for (const item in newData) {
                if (objType(newData[item], 'object')) {
                  if (Array.isArray(newData[item].tags)) {
                    for (const item2 in newData[item].tags) {
                      if (
                        typeof newData[item].tags[item2] === 'string' &&
                        listTags.indexOf(newData[item].tags[item2]) < 0
                      ) {
                        listTags.push(newData[item].tags[item2]);
                      }
                    }
                  }

                  rooms.push(newData[item]);
                }
              }

              setList(listTags);
              setRoomData(rooms);
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
      };

      loadingFetch();
      botListUpdate = setInterval(() => botListUpdate(), 60000);
    }

    const chatroom = $('.tiny-welcome #chatrooms .chatroom');
    let rainbowPosition = 124;
    const intervalChatRoom = setInterval(() => {
      rainbowBorder(chatroom, rainbowPosition);
      rainbowPosition += rainbowPosition > 20 && rainbowPosition < 320 ? 1 : 0.2;
      if (rainbowPosition > 360) rainbowPosition = 0;
    }, 12);

    rainbowBorder(chatroom, rainbowPosition);
    return () => {
      clearInterval(intervalChatRoom);
      if (botListUpdate) clearInterval(botListUpdate);
    };
  });

  const users = [];
  const rooms = [];

  if (!loadingData && Array.isArray(data)) {
    for (const item in data) {
      if (
        Array.isArray(data[item].tags) &&
        data[item].tags.length > 0 &&
        ((typeof dataTag === 'string' &&
          dataTag.length > 0 &&
          data[item].tags.indexOf(dataTag) > -1) ||
          dataTag === null)
      ) {
        const roomData = {
          agiId: data[item].id,
          description: data[item].desc,
          title: data[item].name,
          tags: data[item].tags,
        };

        try {
          roomData.avatar = insertAgiAvatar(data[item], null);
        } catch (err) {
          console.error(err);
          roomData.avatar = null;
        }

        if (typeof data[item].room_id === 'string') {
          const newRoomData = clone(roomData);
          newRoomData.id = data[item].room_id;
          rooms.push(newRoomData);
        }

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

  // Result
  return (
    <div className={`tiny-welcome border-0 h-100 noselect${isGuest ? ' is-guest' : ''}`}>
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
                  Embed specialized AI tools for visuals, sound, coding, writing – the limit is the
                  imagination of the Pixxels community
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

          <center style={{ width: '100%', display: 'block' }}>
            <img
              src="./img/pixxel-logo/logo3.png"
              alt="logo"
              style={{
                maxWidth: '50%',
                width: 'auto',
                height: 'auto',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          </center>
        </div>

        {__ENV_APP__.MODE === 'development' ? (
          <iframe ref={morphic} id="morphic" src="https://www.morphic.sh/" />
        ) : null}

        <div id="search-title">
          <div className="search-info mb-3">
            <form className="search-form mb-2 mt-3" onSubmit={handleSearchSubmit}>
              <input
                className="search-input btn btn-bg w-100 border"
                type="text"
                value={tempSearch}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
                placeholder="Search for bots and rooms..."
              />
            </form>
          </div>
        </div>

        <center className="taggy taggy2">
          {list && (
            <>
              <button
                className={`btn taggyButton btn-bg very-small border${dataTag === null ? ' active' : ''} text-lowercase`}
                key="CLEAR_ALL"
                onClick={() => setSelectedTag(null)}
              >
                all
              </button>

              {list.map((tag) => (
                <button
                  className={`btn taggyButton btn-bg very-small border${typeof dataTag === 'string' && dataTag === tag ? ' active' : ''} text-lowercase`}
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </>
          )}
        </center>

        {!loadingData ? (
          <>
            {users.length > 0 ? categoryGenerator('popular_bots', 'bots', 'Bots', users) : null}
            {rooms.length > 0 ? categoryGenerator('popular_rooms', 'rooms', 'Rooms', rooms) : null}
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
