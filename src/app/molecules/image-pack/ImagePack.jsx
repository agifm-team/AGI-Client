import React, { useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ClientEvent } from 'matrix-js-sdk';

import {
  emojiExport,
  getEmojiUsage,
  useUserImagePack,
  useRoomImagePack,
  addGlobalImagePack,
  removeGlobalImagePack,
  isGlobalPack,
} from '@src/util/emojiUtil';

import initMatrix from '../../../client/initMatrix';
import { openReusableDialog, updateEmojiList } from '../../../client/action/navigation';
import { suffixRename } from '../../../util/common';

import Button from '../../atoms/button/Button';
import Text from '../../atoms/text/Text';
import Input from '../../atoms/input/Input';
import Checkbox from '../../atoms/button/Checkbox';

import { ImagePack as ImagePackBuilder } from '../../organisms/emoji-board/custom-emoji';
import { confirmDialog } from '../confirm-dialog/ConfirmDialog';
import ImagePackProfile from './ImagePackProfile';
import ImagePackItem from './ImagePackItem';
import ImagePackUpload from './ImagePackUpload';
import { getSelectRoom } from '../../../util/selectedRoom';
import { getCurrentState } from '../../../util/matrixUtil';

const renameImagePackItem = (shortcode) =>
  new Promise((resolve) => {
    let isCompleted = false;

    openReusableDialog(
      <Text variant="s1" weight="medium">
        Rename
      </Text>,
      (requestClose) => (
        <div style={{ padding: 'var(--sp-normal)' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const sc = e.target.shortcode.value;
              if (sc.trim() === '') return;

              isCompleted = true;
              resolve(sc.trim());
              requestClose();
            }}
          >
            <div>
              <Input value={shortcode} name="shortcode" label="Shortcode" autoFocus required />
            </div>
            <div style={{ height: 'var(--sp-normal)' }} />
            <Button variant="primary" type="submit">
              Rename
            </Button>
          </form>
        </div>
      ),
      () => {
        if (!isCompleted) resolve(null);
      },
    );
  });

function useImagePackHandles(pack, sendPackContent) {
  const [, forceUpdate] = useReducer((count) => count + 1, 0);

  const getNewKey = (key) => {
    if (typeof key !== 'string') return undefined;
    let newKey = key?.replace(/\s/g, '_');
    if (pack.getImages().get(newKey)) {
      newKey = suffixRename(newKey, (suffixedKey) => pack.getImages().get(suffixedKey));
    }
    return newKey;
  };

  const handleAvatarChange = (url) => {
    pack.setAvatarUrl(url);
    sendPackContent(pack.getContent());
    forceUpdate();
  };

  const handleEditProfile = (name, attribution) => {
    pack.setDisplayName(name);
    pack.setAttribution(attribution);
    sendPackContent(pack.getContent());
    forceUpdate();
  };

  const handleUsageChange = (newUsage) => {
    const usage = [];
    if (newUsage === 'emoticon' || newUsage === 'both') usage.push('emoticon');
    if (newUsage === 'sticker' || newUsage === 'both') usage.push('sticker');
    pack.setUsage(usage);
    pack.getImages().forEach((img) => pack.setImageUsage(img.shortcode, undefined));

    sendPackContent(pack.getContent());
    forceUpdate();
  };

  const handleRenameItem = async (key) => {
    const newKey = getNewKey(await renameImagePackItem(key));

    if (!newKey || newKey === key) return;
    pack.updateImageKey(key, newKey);

    sendPackContent(pack.getContent());
    forceUpdate();
  };

  const handleDeleteItem = async (key) => {
    const isConfirmed = await confirmDialog(
      'Delete',
      `Are you sure that you want to delete "${key}"?`,
      'Delete',
      'danger',
    );
    if (!isConfirmed) return;
    pack.removeImage(key);

    sendPackContent(pack.getContent());
    forceUpdate();
  };

  const handleUsageItem = (key, newUsage) => {
    const usage = [];
    if (newUsage === 'emoticon' || newUsage === 'both') usage.push('emoticon');
    if (newUsage === 'sticker' || newUsage === 'both') usage.push('sticker');
    pack.setImageUsage(key, usage);

    sendPackContent(pack.getContent());
    forceUpdate();
  };

  const handleAddItem = (key, url) => {
    const newKey = getNewKey(key);
    if (!newKey || !url) return;

    pack.addImage(newKey, {
      url,
    });

    sendPackContent(pack.getContent());
    forceUpdate();
  };

  return {
    handleAvatarChange,
    handleEditProfile,
    handleUsageChange,
    handleRenameItem,
    handleDeleteItem,
    handleUsageItem,
    handleAddItem,
  };
}

function ImagePack({ roomId, stateKey, handlePackDelete = null }) {
  const mx = initMatrix.matrixClient;
  const mxcUrl = initMatrix.mxcUrl;
  const room = mx.getRoom(roomId);
  const [viewMore, setViewMore] = useState(false);
  const [isGlobal, setIsGlobal] = useState(isGlobalPack(roomId, stateKey));

  const { pack, sendPackContent } = useRoomImagePack(roomId, stateKey);

  const {
    handleAvatarChange,
    handleEditProfile,
    handleUsageChange,
    handleRenameItem,
    handleDeleteItem,
    handleUsageItem,
    handleAddItem,
  } = useImagePackHandles(pack, sendPackContent);

  const handleGlobalChange = (isG) => {
    setIsGlobal(isG);
    if (isG) addGlobalImagePack(roomId, stateKey);
    else removeGlobalImagePack(roomId, stateKey);
  };

  const canChange = getCurrentState(room).maySendStateEvent(
    'im.ponies.room_emotes',
    mx.getUserId(),
  );

  const handleDeletePack = async () => {
    const isConfirmed = await confirmDialog(
      'Delete Pack',
      `Are you sure that you want to delete "${pack.displayName}"?`,
      'Delete',
      'danger',
    );
    if (!isConfirmed) return;

    handlePackDelete(stateKey);
  };

  const images = [...pack.images].slice(0, viewMore ? pack.images.size : 2);

  return (
    <li className="list-group-item image-pack">
      <ImagePackProfile
        avatarUrl={pack.avatarUrl ? mxcUrl.toHttp(pack.avatarUrl, 42, 42, 'crop') : null}
        displayName={pack.displayName ?? 'Unknown'}
        attribution={pack.attribution}
        usage={getEmojiUsage(pack.usage)}
        onUsageChange={canChange ? handleUsageChange : null}
        onAvatarChange={canChange ? handleAvatarChange : null}
        onEditProfile={canChange ? handleEditProfile : null}
      />
      {canChange && <ImagePackUpload onUpload={handleAddItem} roomId={roomId} />}

      {images.length === 0 ? null : (
        <div>
          <div className="image-pack__header">
            <div className="very-small text-gray">Image</div>
            <div className="very-small text-gray">Shortcode</div>
            <div className="very-small text-gray">Usage</div>
          </div>
          {images.map(([shortcode, image]) => (
            <ImagePackItem
              key={shortcode}
              url={mxcUrl.toHttp(image.mxc)}
              shortcode={shortcode}
              usage={getEmojiUsage(image.usage)}
              onUsageChange={canChange ? handleUsageItem : undefined}
              onDelete={canChange ? handleDeleteItem : undefined}
              onRename={canChange ? handleRenameItem : undefined}
            />
          ))}
        </div>
      )}

      <div className="image-pack__footer">
        {pack.images.size > 2 || handlePackDelete ? (
          <>
            {pack.images.size > 2 && (
              <Button onClick={() => setViewMore(!viewMore)}>
                {viewMore ? 'View less' : `View ${pack.images.size - 2} more`}
              </Button>
            )}
            <Button onClick={() => emojiExport(pack.displayName ?? 'Unknown', [...pack.images])}>
              Export
            </Button>
            {handlePackDelete && (
              <Button variant="danger" onClick={handleDeletePack}>
                Delete Pack
              </Button>
            )}
          </>
        ) : (
          <Button onClick={() => emojiExport(pack.displayName ?? 'Unknown', [...pack.images])}>
            Export
          </Button>
        )}
      </div>

      <div className="image-pack__global">
        <Checkbox variant="success" onToggle={handleGlobalChange} isActive={isGlobal} />
        <div>
          <Text variant="b2">Use globally</Text>
          <div className="very-small text-gray">
            Add this pack to your account to use in all rooms.
          </div>
        </div>
      </div>
    </li>
  );
}

ImagePack.propTypes = {
  roomId: PropTypes.string.isRequired,
  stateKey: PropTypes.string.isRequired,
  handlePackDelete: PropTypes.func,
};

function ImagePackUser() {
  const mx = initMatrix.matrixClient;
  const mxcUrl = initMatrix.mxcUrl;
  const [viewMore, setViewMore] = useState(false);

  const { pack, sendPackContent } = useUserImagePack();

  const {
    handleAvatarChange,
    handleEditProfile,
    handleUsageChange,
    handleRenameItem,
    handleDeleteItem,
    handleUsageItem,
    handleAddItem,
  } = useImagePackHandles(pack, sendPackContent);

  const images = [...pack.images].slice(0, viewMore ? pack.images.size : 2);

  return (
    <div className="card noselect">
      <ul className="list-group list-group-flush">
        <ImagePackProfile
          avatarUrl={pack.avatarUrl ? mxcUrl.toHttp(pack.avatarUrl, 42, 42, 'crop') : null}
          displayName={pack.displayName ?? 'Personal'}
          attribution={pack.attribution}
          usage={getEmojiUsage(pack.usage)}
          onUsageChange={handleUsageChange}
          onAvatarChange={handleAvatarChange}
          onEditProfile={handleEditProfile}
        />

        <ImagePackUpload onUpload={handleAddItem} />

        {images.length === 0 ? null : (
          <div>
            <div className="image-pack__header">
              <div className="very-small text-gray">Image</div>
              <div className="very-small text-gray">Shortcode</div>
              <div className="very-small text-gray">Usage</div>
            </div>
            {images.map(([shortcode, image]) => (
              <ImagePackItem
                key={shortcode}
                url={mxcUrl.toHttp(image.mxc)}
                shortcode={shortcode}
                usage={getEmojiUsage(image.usage)}
                onUsageChange={handleUsageItem}
                onDelete={handleDeleteItem}
                onRename={handleRenameItem}
              />
            ))}
          </div>
        )}

        <li className="list-group-item">
          <center>
            {pack.images.size > 2 && (
              <>
                <Button onClick={() => setViewMore(!viewMore)}>
                  {viewMore ? 'View less' : `View ${pack.images.size - 2} more`}
                </Button>
                <br />
              </>
            )}
            <Button onClick={() => emojiExport('Personal Pack', [...pack.images])}>
              Export Personal Emojis
            </Button>
          </center>
        </li>
      </ul>
    </div>
  );
}

function useGlobalImagePack() {
  const [, forceUpdate] = useReducer((count) => count + 1, 0);
  const mx = initMatrix.matrixClient;

  const roomIdToStateKeys = new Map();
  const globalContent = mx.getAccountData('im.ponies.emote_rooms')?.getContent() ?? { rooms: {} };
  const { rooms } = globalContent;

  Object.keys(rooms).forEach((roomId) => {
    if (typeof rooms[roomId] !== 'object') return;
    const room = mx.getRoom(roomId);
    const stateKeys = Object.keys(rooms[roomId]);
    if (!room || stateKeys.length === 0) return;
    roomIdToStateKeys.set(roomId, stateKeys);
  });

  useEffect(() => {
    const handleEvent = (event) => {
      if (event.getType() === 'im.ponies.emote_rooms') forceUpdate();
    };
    mx.addListener(ClientEvent.AccountData, handleEvent);
    return () => {
      mx.removeListener(ClientEvent.AccountData, handleEvent);
    };
  }, []);

  return roomIdToStateKeys;
}

function ImagePackGlobal() {
  const mx = initMatrix.matrixClient;
  const roomIdToStateKeys = useGlobalImagePack();

  const handleChange = (roomId, stateKey) => {
    removeGlobalImagePack(roomId, stateKey);
  };

  return (
    <div className="card noselect mt-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item very-small text-gray">Global packs</li>

        <div>
          {roomIdToStateKeys.size > 0 ? (
            [...roomIdToStateKeys].map(([roomId, stateKeys]) => {
              const room = mx.getRoom(roomId);

              return stateKeys.map((stateKey) => {
                const data = getCurrentState(room).getStateEvents(
                  'im.ponies.room_emotes',
                  stateKey,
                );
                const pack = ImagePackBuilder.parsePack(data?.getId(), data?.getContent());
                if (!pack) return null;
                return (
                  <li className="list-group-item" key={pack.id}>
                    <div className="row">
                      <div className="col-md-1">
                        <center>
                          <Checkbox
                            variant="success"
                            onToggle={() => handleChange(roomId, stateKey)}
                            isActive
                          />
                        </center>
                      </div>

                      <div className="col-md-11 ps-0">
                        <div className="small">{pack.displayName ?? 'Unknown'}</div>
                        <div className="very-small text-gray">{room.name}</div>
                      </div>
                    </div>
                  </li>
                );
              });
            })
          ) : (
            <li className="list-group-item small text-gray">
              <center>No global packs</center>
            </li>
          )}
        </div>
      </ul>
    </div>
  );
}

export default ImagePack;

export { ImagePackUser, ImagePackGlobal };
