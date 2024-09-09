// src/app/organisms/room/PeopleDrawer.jsx

import { checkRoomAgents } from '@mods/agi-mod/bots/PeopleSelector/lib';

checkRoomAgents(roomId, { bots })
  .then((data) => {
    const tinyList = [];
    if (Array.isArray(data)) {
      for (const item in data) {
        const tinyData = data.find((i) =>
          !i.startsWith('@') ? `@${i}` === data[item] : i === data[item],
        );
        if (tinyData) tinyList.push(tinyData);
      }
    }

    setAgents(tinyList);
    setMemberList(simplyfiMembers(membersData));
  })
  .catch((err) => {
    alert(err.message);
    console.error(err);
    setMemberList(simplyfiMembers(membersData));
  });
