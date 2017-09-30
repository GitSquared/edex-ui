const {app, BrowserWindow} = require("electron");

console.log(`
    ===========================================================
              Starting eDEX-UI v${app.getVersion()} with Node ${process.versions.node}
                           on Electron ${process.versions.electron}
    ===========================================================`);

const electron = require("electron");
const pty = require("node-pty");
const ws = require("ws").Server;
const path = require("path");
const url = require("url");

let win, wss, tty;

app.on('ready', () => {
    tty = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.PWD,
        env: process.env
    });

    wss = new ws({port: 3000});
    wss.on('connection', (ws) => {
        console.log("connected");
        ws.on('message', (msg) => {
            tty.write(msg);
        });
        tty.on('data', (data) => {
            try {
                ws.send(data);
            } catch (e) {
                // Websocket closed
            }
        });
    });
    wss.on('close', () => {
        console.log("closed");
        tty.kill();
    });

    let {x, y, width, height} = electron.screen.getPrimaryDisplay().bounds;
    width++; height++;
    win = new BrowserWindow({
        title: "eDEX-UI",
        x,
        y,
        width,
        height,
        show: false,
        resizable: true,
        movable: false,
        alwaysOnTop: true,
        fullscreen: true,
        // focusable: false,
        skipTaskbar: true,
        autoHideMenuBar: true,
        frame: true
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'ui.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.once("ready-to-show", () => {
        win.show();
        win.setResizable(false);
    });
});

app.on('window-all-closed', () => {
    app.quit();
});
