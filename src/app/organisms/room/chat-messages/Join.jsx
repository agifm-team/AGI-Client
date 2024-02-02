import React from 'react';
import LibMessages from './LibMessages';
import { twemojifyReact } from '../../../../util/twemojify';

export default function JoinMessage({ user, date }) {
  return (
    <LibMessages
      user={user}
      date={date}
      where="join_user"
      defaultMessage={
        <>
          <strong>{twemojifyReact(user)}</strong>
          {' joined the room'}
        </>
      }
    />
  );
}
