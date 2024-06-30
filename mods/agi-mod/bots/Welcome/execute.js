import { setLoadingPage } from '@src/app/templates/client/Loading';
import { selectRoom, selectRoomMode, selectTab } from '@src/client/action/navigation';
import { join } from '@src/client/action/room';
import initMatrix from '@src/client/initMatrix';
import { hasDMWith, hasDevice } from '@src/util/matrixUtil';
import * as roomActions from '@src/client/action/room';

const openRoom = (roomId) => {
  const mx = initMatrix.matrixClient;
  const room = mx.getRoom(roomId);

  if (!room) return;
  if (room.isSpaceRoom()) selectTab(roomId);
  else {
    selectRoomMode('room');
    selectRoom(roomId);
  }
};

export const joinAiSpace = async (alias) => {
  const mx = initMatrix.matrixClient;
  setLoadingPage('Looking for address...');
  let via;
  if (alias.startsWith('#')) {
    try {
      const aliasData = await mx.getRoomIdForAlias(alias);
      via = aliasData?.servers.slice(0, 3) || [];
      setLoadingPage(`Joining ${alias}...`);
    } catch (err) {
      setLoadingPage(false);
      console.error(err);
      alert(
        `Unable to find room/space with ${alias}. Either room/space is private or doesn't exist.`,
      );
    }
  }
  try {
    const roomId = await join(alias, false, via);
    openRoom(roomId);
    setLoadingPage(false);
  } catch {
    setLoadingPage(false);
    alert(`Unable to join ${alias}. Either room/space is private or doesn't exist.`);
  }
};

export const joinAiRoom = async (alias) => {
  const mx = initMatrix.matrixClient;
  setLoadingPage('Looking for address...');
  let via;
  if (alias.startsWith('#')) {
    try {
      const aliasData = await mx.getRoomIdForAlias(alias);
      via = aliasData?.servers.slice(0, 3) || [];
      setLoadingPage(`Joining ${alias}...`);
    } catch (err) {
      setLoadingPage(false);
      console.error(err);
      alert(
        `Unable to find room/space with ${alias}. Either room/space is private or doesn't exist.`,
      );
    }
  }
  try {
    const roomId = await join(alias, false, via);
    openRoom(roomId);
    setLoadingPage(false);
  } catch {
    setLoadingPage(false);
    alert(`Unable to join ${alias}. Either room/space is private or doesn't exist.`);
  }
};

export const joinAiBot = async (userId) => {
  // Check and open if user already have a DM with userId.
  const dmRoomId = hasDMWith(userId);
  if (dmRoomId) {
    selectRoomMode('room');
    selectRoom(dmRoomId);
    return;
  }

  // Create new DM
  try {
    setLoadingPage();
    const { room_id } = await roomActions.createDM(userId, await hasDevice(userId));
    selectRoom(room_id);
    setLoadingPage(false);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
