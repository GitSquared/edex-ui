const {app, BrowserWindow} = require("electron");
const electron = require("electron");
const path = require("path");
const url = require("url");

let win;

app.on('ready', () => {
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
