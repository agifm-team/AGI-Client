import React, { useEffect } from 'react';

import moment, { momentFormat } from '@src/util/libs/momentjs';

import initMatrix from '@src/client/initMatrix';
import { getAppearance } from '@src/util/libs/appearance';
import { dfAvatarSize, getCurrentState } from '@src/util/matrixUtil';
import { twemojifyReact } from '@src/util/twemojify';

import { useForceUpdate } from '../../../hooks/useForceUpdate';
import RoomIntro from '../../../molecules/room-intro/RoomIntro';
import cons from '../../../../client/state/cons';

export default function RoomIntroContainer({ event, timeline }) {
  const [, nameForceUpdate] = useForceUpdate();

  const appearanceSettings = getAppearance();
  const mx = initMatrix.matrixClient;
  const mxcUrl = initMatrix.mxcUrl;

  const { roomList } = initMatrix;
  const { room, thread } = timeline;

  const rootContent = thread && thread.rootEvent ? thread.rootEvent.getContent() : null;
  const roomTitle =
    !thread || !rootContent || typeof rootContent.body !== 'string'
      ? room.name
      : rootContent.body.length < 100
        ? rootContent.body
        : rootContent.body.substring(0, 100);

  const roomTopic = getCurrentState(room).getStateEvents('m.room.topic')[0]?.getContent().topic;
  const isDM = roomList.directs.has(timeline.roomId);
  let avatarSrc = mxcUrl.getAvatarUrl(room, dfAvatarSize, dfAvatarSize);
  avatarSrc = isDM
    ? mxcUrl.getAvatarUrl(room.getAvatarFallbackMember(), dfAvatarSize, dfAvatarSize)
    : avatarSrc;

  let avatarAnimSrc = mxcUrl.getAvatarUrl(room);
  avatarAnimSrc = isDM ? mxcUrl.getAvatarUrl(room.getAvatarFallbackMember()) : avatarAnimSrc;

  const heading = isDM ? roomTitle : `Welcome to ${roomTitle}`;
  const topic = !thread
    ? twemojifyReact(roomTopic || '', undefined, true)
    : twemojifyReact('', undefined, true);
  const nameJsx = twemojifyReact(roomTitle);
  const desc =
    isDM && !thread ? (
      <>
        This is the beginning of your direct message history with @<strong>{nameJsx}</strong>
        {'. '}
        {topic}
      </>
    ) : (
      <>
        {'This is the beginning of the '}
        <strong>{nameJsx}</strong>
        {` ${!thread ? 'room' : 'thread'}.${!thread ? ' ' : ''}`}
        {topic}
      </>
    );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handleUpdate = () => nameForceUpdate();

    roomList.on(cons.events.roomList.ROOM_PROFILE_UPDATED, handleUpdate);
    return () => {
      roomList.removeListener(cons.events.roomList.ROOM_PROFILE_UPDATED, handleUpdate);
    };
  }, []);

  return (
    <RoomIntro
      roomId={timeline.roomId}
      avatarSrc={avatarSrc}
      avatarAnimSrc={avatarAnimSrc}
      name={roomTitle}
      heading={twemojifyReact(heading)}
      desc={desc}
      time={
        event
          ? `Created at ${moment(event.getDate()).format(`DD MMMM YYYY, ${momentFormat.clock()}`)}`
          : null
      }
    />
  );
}
