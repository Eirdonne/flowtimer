const { app, BrowserWindow, ipcMain, Notification, screen } = require('electron');
const path = require('path');

let timerWindow;
let notchWindow;
let state = {
  mode: 'down',
  duration: 300,
  elapsed: 0,
  running: false,
  updatedAt: Date.now(),
};

function createWindows() {
  timerWindow = new BrowserWindow({
    width: 360,
    height: 292,
    minWidth: 320,
    minHeight: 250,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    visibleOnAllWorkspaces: true,
    titleBarStyle: 'hiddenInset',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true },
  });
  timerWindow.setAlwaysOnTop(true, 'floating');
  timerWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  timerWindow.loadFile(path.join(__dirname, 'timer.html'));

  const display = screen.getPrimaryDisplay();
  const bounds = display.workArea;
  notchWindow = new BrowserWindow({
    width: 300,
    height: 66,
    x: Math.round(bounds.x + bounds.width / 2 - 150),
    y: Math.max(6, bounds.y + 5),
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    visibleOnAllWorkspaces: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true },
  });
  notchWindow.setAlwaysOnTop(true, 'floating');
  notchWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  notchWindow.loadFile(path.join(__dirname, 'notch.html'));

  timerWindow.on('closed', () => { timerWindow = null; });
  notchWindow.on('closed', () => { notchWindow = null; });
}

function broadcast() {
  for (const win of [timerWindow, notchWindow]) {
    if (win && !win.isDestroyed()) win.webContents.send('state', state);
  }
}

function updateState(next) {
  state = { ...state, ...next, updatedAt: Date.now() };
  broadcast();
}

ipcMain.handle('get-state', () => state);
ipcMain.on('set-state', (_event, next) => updateState(next));
ipcMain.on('notify-complete', () => {
  if (Notification.isSupported()) new Notification({ title: 'FlowTimer', body: 'Time is up.' }).show();
});
ipcMain.on('quit-app', () => app.quit());
ipcMain.on('show-timer', () => timerWindow?.show());
ipcMain.on('drag-notch', (_event, point) => {
  if (notchWindow && point) notchWindow.setPosition(Math.round(point.x), Math.round(point.y));
});

app.whenReady().then(() => {
  createWindows();
  app.on('activate', () => timerWindow?.show());
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('before-quit', () => { state.running = false; });
