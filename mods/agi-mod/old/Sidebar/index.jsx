// src/app/organisms/navigation/Sidebar/index.jsx
import { openSuperAgent } from '@mods/agi-mod/menu/Buttons';

<SidebarAvatar
  id="agi-superagent"
  tooltip="SuperAgent"
  onClick={() => openSuperAgent()}
  avatar={
    <Avatar
      neonColor
      iconColor={!isIconsColored ? null : 'rgb(41, 220, 131)'}
      faSrc="fa-solid fa-user-ninja"
      className="profile-image-container"
      size="normal"
    />
  }
/>;
