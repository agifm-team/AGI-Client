import { objType } from 'for-promise/utils/lib.mjs';

import { defaultAvatar } from '@src/app/atoms/avatar/defaultAvatar';
import * as roomActions from '@src/client/action/room';
import { getRoomInfo } from '@src/app/organisms/room/Room';
import { setLoadingPage } from '@src/app/templates/client/Loading';
import initMatrix from '@src/client/initMatrix';
import { btModal } from '@src/util/tools';

import { serverAddress } from '../socket';

import { duplicatorAgent } from '../bots/PeopleSelector/lib';
import { insertAgiAvatar } from '../lib';

const userGenerator = (data, username, botid, nickname, avatar) =>
  $('<div>', { class: 'room-tile' }).append(
    $('<div>', { class: 'room-tile__avatar' }).append(
      $('<div>', { class: 'avatar-container avatar-container__normal  noselect' }).append(
        $('<img>', {
          class: 'avatar-react img-fluid',
          draggable: false,
          src: avatar,
          alt: nickname,
        }).css('background-color', 'transparent'),
      ),
    ),

    $('<div>', { class: 'room-tile__content emoji-size-fix' }).append(
      $('<h4>', { class: 'text text-s1 text-normal' }).text(nickname),
      $('<div>', { class: 'very-small text-gray' }).text(username),
    ),

    $('<div>', { class: 'room-tile__options' }).append(
      $('<button>', { class: 'btn btn-primary btn-sm noselect', type: 'button' })
        .data('pony-house-username', username)
        .data('pixx-bot-data', data)
        .text('Invite')
        .on('click', async (event) => {
          const userId = $(event.target).data('pony-house-username');
          const roomId = getRoomInfo().roomTimeline.room.roomId;

          setLoadingPage();
          roomActions
            .invite(roomId, userId)
            .then(() => setLoadingPage(false))
            .catch((err) => {
              console.error(err);
              alert(err.message);
              setLoadingPage(false);
            });
        }),

      $('<button>', { class: 'btn btn-primary btn-sm noselect ms-2', type: 'button' })
        .data('pony-house-username', username)
        .data('pony-house-botid', botid)
        .data('pixx-bot-data', data)
        .text('Duplicate')
        .on('click', async (event) => {
          const userId = $(event.target).data('pony-house-username');
          const botId = $(event.target).data('pony-house-botid');

          setLoadingPage();
          duplicatorAgent(data)
            .then(() => {
              setLoadingPage(false);
            })
            .catch((err) => {
              console.error(err);
              alert(err.message);
            });
        }),
    ),
  );

const clickAIButton = () => {
  setLoadingPage();
  const mx = initMatrix.matrixClient;

  fetch(`${serverAddress}list/${mx.getUserId()}`, {
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .then((tinyData) => {
      if (objType(tinyData, 'object') && Array.isArray(tinyData.personal)) {
        const data = tinyData.personal;
        // Prepare to read data
        setLoadingPage(false);
        const users = [];
        for (const item in data) {
          if (objType(data[item], 'object')) {
            let newPhoto = null;
            try {
              newPhoto = insertAgiAvatar(data[item], null);
              if (!newPhoto) newPhoto = data[item].profile_photo;
              if (!newPhoto) newPhoto = defaultAvatar(1);
            } catch {
              newPhoto = defaultAvatar(1);
            }

            // Get Users
            try {
              const userId = !data[item].bot_username.startsWith('@')
                ? `@${data[item].bot_username}`
                : data[item].bot_username;
              const user = mx.getUser(userId) ?? {
                userId,
                displayName: data[item].agent_name,
                avatarUrl: newPhoto,
              };
              if (objType(user, 'object')) {
                users.push(
                  userGenerator(
                    data[item],
                    user.userId ?? userId,
                    data[item].id,
                    user.displayName
                      ? user.displayName
                      : user.userId ?? data[item].agent_name
                        ? data[item].agent_name
                        : user.userId,
                    user.avatarUrl ? mx.mxcUrlToHttp(user.avatarUrl, 42, 42, 'crop') : newPhoto,
                  ),
                );
              } else {
                users.push(
                  userGenerator(
                    data[item],
                    userId,
                    data[item].id,
                    data[item].agent_name ? data[item].agent_name : userId,
                    newPhoto,
                  ),
                );
              }
            } catch (err) {
              // Error
              console.error(err);
              users.push(userGenerator({}, data[item], null, data[item], defaultAvatar(1)));
            }
          }
        }

        // Empty
        if (users.length < 1) {
          users.push($('<center>', { class: 'small mt-3' }).text('No bots were found.'));
        }

        // Show List
        btModal({
          id: 'agi-bots-menu-modal',
          dialog: 'modal-lg',
          title: 'Add AI bot to the room',

          body: $('<div>', { class: 'invite-user' }).append(
            $('<div>', { class: 'small mb-3' }).text('List of available bots to be added'),
            $('<div>', { class: 'invite-user__content' }).append(users),
          ),
        });
      } else {
        setLoadingPage(false);
      }
    })
    .catch((err) => {
      setLoadingPage(false);
      console.error(err);
      alert(err.message);
    });
};

export { clickAIButton };
