const electron = require('electron')
const app = electron.app
// const id = electron.start('prevent-display-sleep');
// console.log(powerSaveBlocker.isStarted(id));

// id.stop(id);

const browserWindow = electron.BrowserWindow

app.on('ready', function () {
  var mainWindow = new browserWindow({
    width: 1000,
    height: 600
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`)
})
