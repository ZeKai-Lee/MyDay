const { app, BrowserWindow } = require('electron');
const path = require('path');

app.setName('MyDay');

function createWindow(){
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 600,
    title: 'MyDay',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile(path.join(__dirname, 'MyDay.html'));
  win.webContents.on('did-finish-load', () => {
    console.log('[MyDay] loaded ok, title =', win.getTitle());
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => app.quit());
