/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  Notification
} from 'electron';
// import { autoUpdater } from 'electron-updater';
// import log from 'electron-log';
import MenuBuilder from './menu';

const APP_ICON_PATH = path.join(__dirname, 'assets/icons/tray-icon_64x64.png');
const START_NOTIFICATION_TIMEOUT = 3000;
const END_NOTIFICATION_TIMEOUT = 6000;

// export default class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences:
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js')
          },
    icon: APP_ICON_PATH
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('close', e => {
    e.preventDefault();
    if (mainWindow) {
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

const focusMainWin = () => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }

  mainWindow.show();
  mainWindow.focus();
};

const quitApp = () => {
  mainWindow?.destroy();
  app.quit();
};

const sendStartSignal = () => {
  if (!mainWindow) throw new Error('"mainWindow" is not defined');

  mainWindow.webContents.send('timer-start');
};

const sendStopSignal = () => {
  if (!mainWindow) throw new Error('"mainWindow" is not defined');

  mainWindow.webContents.send('timer-stop');
};

let trayContextMenu: Menu | null = null;
let tray: Tray | null = null;

const setTrayMenu = (t: Tray, m: Menu) => t.setContextMenu(m);

const registerTray = () => {
  tray = new Tray(APP_ICON_PATH);
  tray.setToolTip('This is my application.');
  trayContextMenu = Menu.buildFromTemplate([
    { label: 'Pomodoro', click: focusMainWin },
    { type: 'separator' },
    { id: 'start', label: 'Start', click: sendStartSignal },
    { id: 'stop', label: 'Stop', click: sendStopSignal, enabled: false },
    { type: 'separator' },
    { label: 'Quit', click: quitApp }
  ]);
  setTrayMenu(tray, trayContextMenu);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    quitApp();
  }
});

app.on('ready', () => {
  createWindow();
  registerTray();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

const changeTrayState = (timerRunning: boolean) => {
  if (!trayContextMenu) throw new Error("'trayContextMenu' is not defined");
  if (!tray) throw new Error("'tray' is not defined");
  trayContextMenu.getMenuItemById('start').enabled = !timerRunning;
  trayContextMenu.getMenuItemById('stop').enabled = timerRunning;
  setTrayMenu(tray, trayContextMenu);
};

let timerStartNotification: Notification | null = null;
ipcMain.on('timer-started', () => {
  changeTrayState(true);

  timerStartNotification = new Notification({
    title: 'Pomodoro started..',
    body: 'Go do the shit!',
    icon: APP_ICON_PATH
  });
  timerStartNotification.show();
  setTimeout(() => {
    timerStartNotification?.close();
  }, START_NOTIFICATION_TIMEOUT);
});

ipcMain.on('timer-stopped', () => {
  changeTrayState(false);
});

let timerEndNotification: Notification | null = null;
ipcMain.on('timer-end', () => {
  timerEndNotification = new Notification({
    title: 'End of pomodoro! YAY',
    body: 'Go fuckin piss',
    icon: APP_ICON_PATH
  });
  timerEndNotification.on('click', focusMainWin);
  timerEndNotification.show();
  setTimeout(() => {
    timerEndNotification?.close();
  }, END_NOTIFICATION_TIMEOUT);
});
