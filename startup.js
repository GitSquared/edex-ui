const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

switch (process.platform) {
    case 'win32':
        var shellExec = 'cmd'
        break
    case 'darwin':
        var shellExec = '???'
        break
    case 'linux':
        var shellExec = 'bash'
        break
}

console.log('Starting eDEX-UI with Node '+process.versions.node+', Chrome '+process.versions.chrome+' and Electron '+process.versions.electron)
console.log('Detected platform: '+process.platform)

app.on('ready', startup)
app.on('before-quit', function() {console.log('Terminating eDEX-UI...');})
app.on('will-quit', function() {
    global.shell.kill()
    console.log("Process terminated, exit code 0")
})
app.on('window-all-closed', () => {
    app.quit()
})

function startShell() {
    var spawn = require('child_process').spawn;
    var options = {
        shell: true
    };

    ipcMain.once('shell_output_ready', (event) => {
        global.shell = spawn(shellExec, options);
        global.windowIpc = event.sender;
        global.shell.stdout.on('data', (data) => {
            global.windowIpc.send('shell_stdout', data);
        });
        global.shell.stderr.on('data', (data) => {
            global.windowIpc.send('shell_stdout', data);
            console.log(`shell_ERROR: ${data}`);
        });
        ipcMain.on('shell_input', (event, data) => {
            if (data == 'exit' || data == 'EXIT') {
                app.quit()
            } else if (data == 'restart') {
                console.log("Restarting shell");
                global.shell.kill();
                global.shell = spawn(shellExec, options);
                global.shell.stdout.on('data', (data) => {
                    global.windowIpc.send('shell_stdout', data);
                });
                global.shell.stderr.on('data', (data) => {
                    global.windowIpc.send('shell_stdout', data);
                    console.log(`shell_ERROR: ${data}`);
                });
                global.windowIpc.send('shell_stdout', '----SHELL RESTART----');
            } else {
                global.shell.stdin.write(data+"\n");
            }
        });
    });
}

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
        global.win = null
    })

    console.log('UI launched')
}

function startup () {
    startShell();
    launchMainWindow();
}
