const electron = require('electron')
const app = electron.app

const browserWindow = electron.BrowserWindow

app.on('ready', function () {
  var mainWindow = new browserWindow({
    width: 800,
    height: 600
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`)
})
