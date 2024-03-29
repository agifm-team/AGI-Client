import { serverDomain } from '@mods/agi-mod/socket';
import initMatrix from '@src/client/initMatrix';
import { objType } from '@src/util/tools';

export function otpAccept(member) {
  const mx = initMatrix.matrixClient;

  const room =
    objType(member, 'object') && typeof member.roomId === 'string'
      ? mx.getRoom(member.roomId)
      : null;

  if (room) {
    const inviterId =
      room.getDMInviter === 'function'
        ? room.getDMInviter()
        : typeof room.getCreator === 'function'
          ? room.getCreator()
          : null;
    if (typeof inviterId === 'string' && inviterId === `@otp:${serverDomain}`) {
      mx.joinRoom(member.roomId);
      return true;
    }
  }

  return false;
}
