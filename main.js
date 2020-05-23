const { app, BrowserWindow } = require('electron');
const path = require('path');
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
});

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.openDevTools();
  // and load the index.html of the app.
  // win.loadFile('index.html');
}

app.on('ready', createWindow);
