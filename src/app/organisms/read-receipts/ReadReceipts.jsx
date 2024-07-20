import React, { useState, useEffect } from 'react';

import initMatrix from '../../../client/initMatrix';
import cons from '../../../client/state/cons';
import navigation from '../../../client/state/navigation';
import { getUsername, getUsernameOfRoomMember } from '../../../util/matrixUtil';
import { colorMXID } from '../../../util/colorMXID';

import PeopleSelector from '../../molecules/people-selector/PeopleSelector';
import Dialog from '../../molecules/dialog/Dialog';

import { openProfileViewer } from '../../../client/action/navigation';

function ReadReceipts() {
  const [isOpen, setIsOpen] = useState(false);
  const [readers, setReaders] = useState([]);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const loadReadReceipts = (rId, userIds) => {
      setReaders(userIds);
      setRoomId(rId);
      setIsOpen(true);
    };
    navigation.on(cons.events.navigation.READRECEIPTS_OPENED, loadReadReceipts);
    return () => {
      navigation.removeListener(cons.events.navigation.READRECEIPTS_OPENED, loadReadReceipts);
    };
  }, []);

  const handleAfterClose = () => {
    setReaders([]);
    setRoomId(null);
  };

  function renderPeople(userId) {
    const room = initMatrix.matrixClient.getRoom(roomId);
    const mxcUrl = initMatrix.mxcUrl;
    const member = room.getMember(userId);
    const getUserDisplayName = () => {
      if (room?.getMember(userId)) return getUsernameOfRoomMember(room.getMember(userId));
      return getUsername(userId);
    };
    return (
      <PeopleSelector
        disableStatus
        avatarSize={32}
        key={userId}
        onClick={() => {
          setIsOpen(false);
          openProfileViewer(userId, roomId);
        }}
        avatarSrc={mxcUrl.getAvatarUrl(member, 32, 32, 'crop')}
        name={getUserDisplayName(userId)}
        color={colorMXID(userId)}
      />
    );
  }

  return (
    <Dialog
      className="noselect"
      isOpen={isOpen}
      title="Seen by"
      onAfterClose={handleAfterClose}
      onRequestClose={() => setIsOpen(false)}
    >
      <div style={{ marginTop: 'var(--sp-tight)', marginBottom: 'var(--sp-extra-loose)' }}>
        {readers.map(renderPeople)}
      </div>
    </Dialog>
  );
}

export default ReadReceipts;
