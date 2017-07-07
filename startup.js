const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

console.log('Starting eDEX-UI with Node '+process.versions.node+', Chrome '+process.versions.chrome+' and Electron '+process.versions.electron)
console.log('Detected platform: '+process.platform)

app.on('ready', startup)
app.on('before-quit', function() {console.log('Terminating eDEX-UI...');global.shell.kill();})
app.on('will-quit', function() {
    console.log("Process terminated, exit code 0")
})
app.on('window-all-closed', () => {
    app.quit()
})

function launchMainWindow() {

    global.win = new BrowserWindow({title: "eDEX-UI", show: false, autoHideMenuBar: true, backgroundColor: '#000000', fullscreen: true})

    global.win.loadURL(url.format({
        pathname: path.join(__dirname, 'ui.html'),
        protocol: 'file:',
        slashes: true
    }))

    global.win.once('ready-to-show', () => {
        global.win.show();
        global.win.center();
        global.win.maximize();
    })

    global.win.on('closed', () => {
        global.win = null;
    })

    console.log('UI launched')
}

function launchShellDaemon() {
    global.shell = require('child_process').fork('./tty.js', [], {silent: true});
}

function startup () {
    launchMainWindow();
}
