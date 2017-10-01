const {app, BrowserWindow} = require("electron");

console.log(`
    ===========================================================
              Starting eDEX-UI v${app.getVersion()} with Node ${process.versions.node}
                           on Electron ${process.versions.electron}
    ===========================================================
    `);

const electron = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const Terminal = require("./classes/terminal.class.js").Terminal;

let win, tty;
let settingsFile = path.join(__dirname, "settings.json");

if (!fs.existsSync(settingsFile)) {
    fs.writeFileSync(settingsFile, JSON.stringify({
        shell: (process.platform === "win32") ? "cmd.exe" : "bash",
        keyboard: "EN-us"
    }));
}

app.on('ready', () => {

    let settings = JSON.parse(fs.readFileSync(settingsFile, {encoding: "utf-8"}));

    tty = new Terminal({
        role: "server",
        shell: settings.shell
    });
    tty.onclosed = (code, signal) => {
        console.log("=> Terminal exited - "+code+", "+signal);
        app.quit();
    };
    tty.onopened = () => {
        console.log("=> Connected to front-end");
    };
    tty.onresized = (cols, rows) => {
        console.log("=> Resized terminal to "+cols+"x"+rows);
    };
    tty.ondisconnected = () => {
        tty.tty.kill();
        app.quit();
    };

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
        // skipTaskbar: true,
        autoHideMenuBar: true,
        frame: true,
        backgroundColor: '#000000'
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

app.on('before-quit', () => {
    console.log("=> Shutting down...");
})
