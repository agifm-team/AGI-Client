// src/app/organisms/room/RoomViewCmdBar.jsx

import { checkRoomAgents } from '@mods/agi-mod/bots/PeopleSelector/lib';

// const tinyHash = objectHash(newCmd);

/* checkRoomAgents(roomId, { bots })
  .then((data) => {
    // const tinyHashNow = objectHash(cmd);
    const tinyList = [];
    if (Array.isArray(data)) {
      for (const item in data) {
        const tinyData = newCmd.suggestions.find((i) =>
          !i.userId.startsWith('@') ? `@${i.userId}` === data[item] : i.userId === data[item],
        );
        if (tinyData) tinyList.push(tinyData);
      }
    }

    setAgentsCmd({ prefix: newCmd.prefix, suggestions: tinyList });
  })
  .catch((err) => {
    console.error(err);
    setAgentsCmd({ prefix: newCmd.prefix, suggestions: [] });
  }); */
