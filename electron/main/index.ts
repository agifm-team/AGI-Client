import { app, BrowserWindow, shell, ipcMain, Tray, Menu } from 'electron';

import fs from 'node:fs';
import { release } from 'node:os';
import path from 'node:path';

// @ts-ignore
import { objType } from 'for-promise/utils/lib.mjs';

import startNotifications from './notification';
import startEvents from './events';
import startResizeEvents from './events/resize';
import { appDataPrivate, startTempFolders } from './tempFolders';
// import tinyDB from './db';

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = path.join(__dirname, '../');
process.env.DIST = path.join(process.env.DIST_ELECTRON, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

const openDevTools =
  Array.isArray(process.argv) &&
  typeof process.argv[1] === 'string' &&
  process.argv[1] === '--devtools';

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const title = 'pixx.co';
let isQuiting = false;
let appStarted = false;
let firstTime = false;
let appReady = false;

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = path.join(__dirname, '../preload/index.js');
const tinyUrl = process.env.VITE_DEV_SERVER_URL;
const indexHtml = path.join(process.env.DIST, 'index.html');
const iconPath = path.join(process.env.VITE_PUBLIC, './img/png');
const icon = path.join(iconPath, './cinny.png');

const appShow = {
  change: (value: boolean) => {
    appShow.enabled = value;
    if (win && win.webContents) win.webContents.send('tiny-app-is-show', value);
  },

  enabled: false,
};

async function createWindow() {
  if (!firstTime) {
    // Mark First time
    firstTime = true;

    // Load Frame Extension
    // await loadExtension('frame');

    // Get Data
    const initFile = path.join(appDataPrivate, 'init.json');
    let data = null;
    try {
      data = JSON.parse(fs.readFileSync(initFile, 'utf8'));
      if (!objType(data, 'object')) data = {};
    } catch (e) {
      data = {};
    }

    // Bounds
    const bounds =
      data &&
      data.bounds &&
      typeof data.bounds.width === 'number' &&
      typeof data.bounds.height === 'number'
        ? data.bounds
        : { width: 1200, height: 700 };

    // Create Window
    win = new BrowserWindow({
      title,
      icon,
      show: true,
      autoHideMenuBar: true,
      width: bounds.width,
      height: bounds.height,
      backgroundColor: '#282c34',
      minWidth: 700,
      minHeight: 400,
      webPreferences: {
        preload,
        // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
        nodeIntegration: true,
        contextIsolation: true,
      },
    });

    startTempFolders(win, tinyUrl ? '_dev' : '');
    // await tinyDB(path.join(appDataPrivate, `database${tinyUrl ? '_dev' : ''}.db`), ipcMain, win);
    if (process.platform === 'win32') {
      win.setAppDetails({
        appId: 'Pixxels',
        appIconPath: icon,
        relaunchDisplayName: title,
      });
    }

    ipcMain.on('change-app-icon', (event, img) => {
      try {
        if (typeof img === 'string' && img.length > 0) {
          if (win) win.setIcon(path.join(iconPath, `./${img}`));
        }
      } catch (err) {
        console.error(err);
      }
    });

    // Start modules
    startResizeEvents(ipcMain, win);
    startEvents(ipcMain, win, appShow);
    startNotifications(ipcMain, win);

    // Remove Menu
    win.removeMenu();

    if (tinyUrl) {
      // electron-vite-vue#298
      win.loadURL(tinyUrl);
      // Open devTool if the app is not packaged
      if (!openDevTools) win.webContents.openDevTools();
    } else {
      win.loadFile(indexHtml);
    }

    if (openDevTools) win.webContents.openDevTools();

    // Show Page
    win.once('ready-to-show', () => {
      // if (win) win.show();
      appStarted = true;
      appShow.change(true);

      // Ping
      if (win && win.webContents) {
        win.webContents.send('ping', {
          exe: app.getPath('exe'),
          DIST_ELECTRON: process.env.DIST_ELECTRON,
          DIST: process.env.DIST,
          VITE_DEV_SERVER_URL: process.env.VITE_DEV_SERVER_URL,
          VITE_PUBLIC: process.env.VITE_PUBLIC,
          platform: process.platform,
          preload,
          tinyUrl,
          indexHtml,
          icon,
          title,
        });
      }
    });

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) shell.openExternal(url);
      return { action: 'deny' };
    });

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    // Prevent Close
    win.on('close', (event) => {
      if (win) {
        const winData = { bounds: win.getBounds() };
        fs.writeFileSync(initFile, JSON.stringify(winData));
      }

      if (appStarted) {
        if (!isQuiting) {
          event.preventDefault();
          if (win) win.hide();
          appShow.change(false);
        }

        return false;
      }
    });
  }
}

// Anti Multi Same App
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) {
        win.restore();
      }
      win?.focus();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => createWindow());
  app.on('ready', () => {
    if (!appReady) {
      appReady = true;
      // Show app
      const showApp = () => {
        if (appStarted) {
          if (win) win.show();
          appShow.change(true);
        }
      };

      // Create Tray
      const tray = new Tray(icon);
      const contextMenu = Menu.buildFromTemplate([
        {
          label: title,
          enabled: false,
          icon,
        },
        { type: 'separator' },
        {
          label: `Open ${title}`,
          click: showApp,
        },
        {
          label: `Check for Updates`,
          click: () => {
            if (appStarted) {
              if (win) win.show();
              appShow.change(true);
              if (win) win.webContents.send('check-version', true);
            }
          },
        },
        {
          label: `Refresh Client`,
          click: () => {
            if (appStarted) {
              if (win) win.show();
              appShow.change(true);
              if (win) win.webContents.send('refresh-client', true);
            }
          },
        },
        { type: 'separator' },
        /* {
          label: 'DevTools (Advanced User)',
          click: () => {
            if (appStarted) {
              if (win) win.webContents.openDevTools();
            }
          },
        }, */
        {
          label: `Quit ${title}`,
          click: () => {
            isQuiting = true;
            app.quit();
          },
        },
      ]);

      tray.setToolTip(title);
      tray.setTitle(title);
      tray.setContextMenu(contextMenu);

      if (process.platform === 'linux') tray.on('click', showApp);
      else tray.on('double-click', showApp);

      ipcMain.on('change-tray-icon', (event, img) => {
        try {
          if (typeof img === 'string' && img.length > 0) {
            tray.setImage(path.join(iconPath, `./${img}`));
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  });
}

app.on('window-all-closed', () => {
  win = null;
  isQuiting = true;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${tinyUrl}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
