import React, { useEffect, useState } from 'react';
import { RoomEvent } from 'matrix-js-sdk';
import { generateApiKey } from 'generate-api-key';

import tinyAPI from '@src/util/mods';
import initMatrix from '@src/client/initMatrix';
function OpenRouterTab({ userId, roomId, agentData }) {
  // Prepare
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [botSetting, setBotSetting] = useState(null);

  useEffect(() => {
    if (!isLoading && isEmpty && !isError) {
      setIsLoading(true);
      initMatrix.matrixClient
        .sendEvent(roomId, 'openrouter.settings.get', {
          request_id: generateApiKey(),
        })
        .catch((err) => {
          console.error(err);
          alert(err.message, 'Error Get Open Router');
          isError(true);
          setIsLoading(false);
        });
    }

    const getData = (mEvent, room) => {
      if (
        room.roomId !== roomId ||
        mEvent.getSender() !== userId ||
        mEvent.isRedaction() ||
        mEvent.getType() !== 'm.room.message'
      )
        return;
      const content = mEvent.getContent();
      if (
        content.msgtype !== 'm.openrouter.request' ||
        !content.account_data ||
        !content.account_data.value ||
        content.account_data.type !== 'open_router.bot.settings'
      )
        return;

      setIsEmpty(false);
      setBotSetting(content.account_data.value);
      setIsLoading(false);
    };
    initMatrix.matrixClient.on(RoomEvent.Timeline, getData);
    return () => {
      initMatrix.matrixClient.off(RoomEvent.Timeline, getData);
    };
  });

  // Complete
  console.log(botSetting)
  return <small>This account is non-compatible with Bot Settings.</small>;
}

export default function startOpenRouterTabs() {
  tinyAPI.on(
    'profileTabsSpawn',
    (data, menuBarItems, accountContent, existEthereum, userId, roomId, agentData) => {
      /* if (
        agentData &&
        agentData.data &&
        typeof agentData.data.id === 'string' &&
        agentData.data.id.length > 0
      ) { */
      menuBarItems.unshift({
        menu: () => 'Bot Settings',
        render: ({ userId, accountContent }) => (
          <OpenRouterTab userId={userId} roomId={roomId} agentData={agentData} />
        ),
      });
      // }
    },
  );
}
