const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('flowTimer', {
  getState: () => ipcRenderer.invoke('get-state'),
  setState: (state) => ipcRenderer.send('set-state', state),
  notifyComplete: () => ipcRenderer.send('notify-complete'),
  quit: () => ipcRenderer.send('quit-app'),
  showTimer: () => ipcRenderer.send('show-timer'),
  onState: (callback) => ipcRenderer.on('state', (_event, state) => callback(state)),
});
