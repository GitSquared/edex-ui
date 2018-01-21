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

var win, tty;
const settingsFile = path.join(electron.app.getPath("userData"), "settings.json");
const themesDir = path.join(electron.app.getPath("userData"), "themes");
const innerThemesDir = path.join(__dirname, "assets/themes");
const kblayoutsDir = path.join(electron.app.getPath("userData"), "keyboards");
const innerKblayoutsDir = path.join(__dirname, "assets/kb_layouts");

// Fix userData folder not setup on Windows
try {
    fs.mkdirSync(electron.app.getPath("userData"));
} catch(e) {
    // Folder already exists
}
// Create default settings file
if (!fs.existsSync(settingsFile)) {
    fs.writeFileSync(settingsFile, JSON.stringify({
        shell: (process.platform === "win32") ? "powershell.exe" : "bash",
        cwd: electron.app.getPath("userData"),
        keyboard: "en-US",
        theme: "tron"
    }));
}

// Copy default themes & keyboard layouts
try {
    fs.mkdirSync(themesDir);
} catch(e) {
    // Folder already exists
}
fs.readdirSync(innerThemesDir).forEach((e) => {
    fs.writeFileSync(path.join(themesDir, e), fs.readFileSync(path.join(innerThemesDir, e), {encoding:"utf-8"}));
});
try {
    fs.mkdirSync(kblayoutsDir);
} catch(e) {
    // Folder already exists
}
fs.readdirSync(innerKblayoutsDir).forEach((e) => {
    fs.writeFileSync(path.join(kblayoutsDir, e), fs.readFileSync(path.join(innerKblayoutsDir, e), {encoding:"utf-8"}));
});

app.on('ready', () => {
    let settings = require(settingsFile);

    // Initialize terminal server
    tty = new Terminal({
        role: "server",
        shell: settings.shell,
        cwd: settings.cwd,
        port: settings.port || 3000
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
        frame: false,
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
});
