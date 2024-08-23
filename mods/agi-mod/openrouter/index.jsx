import React, { useEffect, useState } from 'react';

import tinyAPI from '@src/util/mods';
import initMatrix from '@src/client/initMatrix';

function OpenRouterTab({ userId, accountContent }) {
  // Prepare
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Complete
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
      menuBarItems.push({
        menu: () => 'Bot Settings',
        render: ({ userId, accountContent }) => (
          <OpenRouterTab userId={userId} roomId={roomId} agentData={agentData} />
        ),
      });
      // }
    },
  );
}
