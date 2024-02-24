# Mod and patch Support (Alpha)

You can freely develop mods for Pony House. Use the index file in this folder to choose which mods you want to enable or disable.

Features are still under development. I will update this file with more information during the time.

**WARNING!!**

Using mods that attempt to modify Pony House's primary files can corrupt other mods and the app itself. If you are trying this, fork the repository instead of trying to develop a mod.

## Event Arguments

The first argument will always be the final value that will be sent to the application's API.

This value must always be an object. If this object is replaced by something else, a null will be sent to the API.

To find out what global values are available, use this console debug. 

Emitters are always reset when you edit mod files via react. But remember that page elements will not have the same effect.

```ts
import tinyAPI from '../../src/util/mods';
console.log(tinyAPI);
```

    tinyAPI.on(eventName, callback)
    tinyAPI.once(eventName, callback)

    tinyAPI.off(eventName, callback)

<hr/>

## Libs

Here is the list of libraries that are available to use natively within the application.

#### Vega
https://vega.github.io/vega-lite/usage/embed.html

#### MomentJS (with timezone)
https://momentjs.com/

#### jQuery
https://jquery.com/

#### jQuery UI
https://jqueryui.com/

#### Bootstrap 5
https://getbootstrap.com/docs/5.3/getting-started/introduction/

#### Ethers
https://docs.ethers.org/v6/

#### Yjs
https://docs.yjs.dev/

Y.Map, Y.Array, Y.Text only

### Load Custom Theme
src/client/state/settings.js

    insertTheme Function (
        Theme Data,
        Push or Unshift (String value)
    )

    removeTheme Function (id),
    getThemeById Function (id),
    getThemeNameById Function (id)

#### Cache Matrix storage per room
src/util/selectedRoom.js

    dataFolder = storage name
    folderName = object name (from dataFolder)
    where = data id

    data = the data value

    limit = The limit of data that can be stored. Default value is 100. If the limit is exceeded, old data will be automatically deleted during the progress.

    addToDataFolder(dataFolder, folderName, where, data, limit)
    removeFromDataFolder(dataFolder, folderName, where)
    getDataList(dataFolder, folderName, where)

#### Loading Warn
src/app/templates/client/Loading.jsx

    import { setLoadingPage } from '../../app/templates/client/Loading';

    // Start loading
    setLoadingPage();

    // or
    setLoadingPage('Custom message!', 'grow');

    // Disable
    setLoadingPage(false);

<hr/>

## Url Params API

If you want to create resources that load quickly when the client page loads, you need to know how to manipulate the urlParams API.
99% of the class is identical to the original URLSearchParams. (https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

The difference is that the methods below will update the url in real time, and will send events that have the same name as the method.

    import { setLoadingPage } from '../../util/libs/urlParams.js';

    urlParams.set();
    urlParams.delete();
    urlParams.append();

    urlParams.on('set');
    urlParams.on('delete');
    urlParams.on('append');

## Methods

### logger.getData()

Returns an Array with the list of the matrix-sdk logs. (Read-only)

### logger.play()

Display the matrix-sdk logs.

## Events

`src/app/organisms/room/RoomViewContent.jsx`

### emptyTimeline

    forceUpdateLimit function

Empty Timeline loaded

`src/app/organisms/room/Room.jsx`

### setRoomInfo

    roomInfo

`src/client/logger/index.js`

console object = level, message

### consoleRemoveData

    console object

### consoleNewData

    console object

### consoleUpdate

    console cache

`src/app/molecules/message/Message.jsx`

### messageBody

    content
    data = { roomId, senderId, eventId }
    insertMsg

The value "content" contains the data of the received message. The value "insertMsg" contains the default function of creating the message.

Use the msgOptions.custom object to customize the final result of your message. You can optionally combine this together with "insertMsg".

`src/app/organisms/welcome/Welcome.jsx`

### startWelcomePage

    welcomeObject

`src/app/organisms/room/PeopleDrawer.jsx`

### roomMembersOptions

    segments
    isUserList

`src/client/state/navigation.js`

### ethereumUpdated

    address

### roomSettingsToggled (Not ready for production)

    isRoomSettings
    forceScroll

### roomSelected (Not ready for production)

    selectedRoomId
    prevSelectedRoomId
    eventId
    forceScroll

### tabSelected (Not ready for production)

    selectedTab

### spaceSelected (Not ready for production)

    selectedSpaceId

### selectedRoomMode[After]

    roomType

### selectTab

    tabInfo

### selectTab[After]

    tabInfo

### selectedSpace

    roomId

### selectedSpace[After]

    roomId

### selectedRoom 

    roomId
    forceScroll

### selectedRoom[After]

    roomId

### spaceSettingsOpened (Not ready for production)

    roomId
    tabText

### spaceManageOpened (Not ready for production)

    roomId

### spaceAddExistingOpened (Not ready for production)

    roomId

### roomSettingsToggled (Not ready for production)

    isRoomSettings
    tabText
    forceScroll

### RoomInfoUpdated (Not ready for production)

    roomInfo

### shortcutSpacesOpened (Not ready for production)

    <EMPTY>

### inviteListOpened (Not ready for production)

    <EMPTY>

### publicRoomsOpened (Not ready for production)

    searchTerm

### createRoomOpened (Not ready for production)

    isSpace
    parentId

### joinAliasOpened (Not ready for production)

    term

### inviteUserOpened (Not ready for production)

    roomId
    searchTerm

### profileViewerOpened (Not ready for production)

    userId
    roomId

### settingsOpened (Not ready for production)

    tabText

### navigationOpened (Not ready for production)

    <EMPTY>

### emojiboardOpened (Not ready for production)

    roomId
    cords
    requestEmojiCallback
    dom

### readReceiptsOpened (Not ready for production)

    roomId
    userIds

### viewSourceOpened (Not ready for production)

    event

### replyToClicked (Not ready for production)

    userId
    eventId
    body
    formattedBody

### searchOpened (Not ready for production)

    term

### reusableContextMenuOpened (Not ready for production)

    placement
    cords
    render
    afterClose

### reusableDialogOpened (Not ready for production)

    title
    render
    afterClose

### emojiVerificationOpened (Not ready for production)

    request
    targetDevice

### profileUpdated (Not ready for production)

    content

`src/client/state/AccountData.js`

### spaceShortcutUpdate (Not ready for production)

    roomId

### spaceShortcutUpdated (Not ready for production)

    roomId

### categorizeSpaceUpdated (Not ready for production)

    roomId

`src/util/AsyncSearch.js`

### searchResultSent (Not ready for production)

    findingList
    term
    config

`src/app/organisms/navigation/ProfileAvatarMenu.jsx`

### userStatusUpdate

    statusData (object)

`src/util/twemojify.jsx`

### openUrlChecker (await)

    hostname (string)
    protocol (string)

`src/util/userStatusEffects.js`

Every 1 second this event is emitted.

### afkTimeCounter

    counter(number)

Every 1 second this event is emitted. (The value will only be counted when the system is actually working)

The update will only be emitted when there is a change in the user's afk status.

### afkTimeCounterProgress and afkTimeCounterUpdated

    counter(number)

`src/app/organisms/navigation/Drawer.jsx`

When a connection status occurs in the system, a warning will be emitted.

### systemState

    systemStatus (object with status value)

`src/app/organisms/profile-viewer/ProfileViewer.jsx`

When a user opens the profile, these events will be called.

tinyPlace is a jQuery script. Use this to insert the html for your profile tab.

### profileTabs

    actions (List of tab functions to be invoked when a user click on this.)

    Example:
    actions.example_id = function(tinyPlace, user, presenceStatus) {};

### profileTabsSpawn(Ethereum)Before or profileTabs(Ethereum)SpawnAfter

    tinyData (Parsed information about user presence)
    user (User matrix object)
    menuItem (Function to add to your script in the profile tab)

    Example:
    menuItem('Tiny Example', 'example_id')

`others`

### mouseWheel

    event (event)

<hr/>

### Mod Version

You need to convince the user to install the mod on their client. 

### Patch Version

This is a build yourself version of a Pony House client. In this version your mod will already come pre-installed within the application and the user will not be able to uninstall some mods selected by you.