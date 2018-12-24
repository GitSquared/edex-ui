// Disable eval()
window.eval = global.eval = function () {
    throw new Error("eval() is disabled for security reasons.");
};
// Security helper :)
window._escapeHtml = (text) => {
    let map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => {return map[m];});
};
window._purifyCSS = (str) => {
    return str.replace(/[<]/g, "");
};

// Initiate basic error handling
window.onerror = (msg, path, line, col, error) => {
    document.getElementById("boot_screen").innerHTML += `${error} :  ${msg}<br/>==> at ${path}  ${line}:${col}`;
};

const path = require("path");
const fs = require("fs");
const electron = require("electron");
const ipc = electron.ipcRenderer;

const settingsDir = electron.remote.app.getPath("userData");
const themesDir = path.join(settingsDir, "themes");
const keyboardsDir = path.join(settingsDir, "keyboards");
const fontsDir = path.join(settingsDir, "fonts");
const settingsFile = path.join(settingsDir, "settings.json");

// Load config
window.settings = require(settingsFile);

// Load CLI parameters
if (electron.remote.process.argv.includes("--nointro")) {
    window.settings.nointro = true;
} else {
    window.settings.nointro = false;
}

// Retrieve theme override (hotswitch)
ipc.once("getThemeOverride", (e, theme) => {
    if (theme !== null) {
        window.settings.theme = theme;
        window.settings.nointro = true;
        _loadTheme(require(path.join(themesDir, window.settings.theme+".json")));
    } else {
        _loadTheme(require(path.join(themesDir, window.settings.theme+".json")));
    }
});
ipc.send("getThemeOverride");
// Same for keyboard override/hotswitch
ipc.once("getKbOverride", (e, layout) => {
    if (layout !== null) {
        window.settings.keyboard = layout;
        window.settings.nointro = true;
    }
});
ipc.send("getKbOverride");

// Load UI theme
window._loadTheme = (theme) => {

    if (document.querySelector("style.theming")) {
        document.querySelector("style.theming").remove();
    }

    // Load fonts
    let mainFont = new FontFace(theme.cssvars.font_main, `url("${path.join(fontsDir, theme.cssvars.font_main.toLowerCase().replace(/ /g, '_')+'.woff2').replace(/\\/g, '/')}")`);
    let lightFont = new FontFace(theme.cssvars.font_main_light, `url("${path.join(fontsDir, theme.cssvars.font_main_light.toLowerCase().replace(/ /g, '_')+'.woff2').replace(/\\/g, '/')}")`);
    let termFont = new FontFace(theme.terminal.fontFamily, `url("${path.join(fontsDir, theme.terminal.fontFamily.toLowerCase().replace(/ /g, '_')+'.woff2').replace(/\\/g, '/')}")`);

    document.fonts.add(mainFont);
    document.fonts.load("12px "+theme.cssvars.font_main);
    document.fonts.add(lightFont);
    document.fonts.load("12px "+theme.cssvars.font_main_light);
    document.fonts.add(termFont);
    document.fonts.load("12px "+theme.terminal.fontFamily);

    document.querySelector("head").innerHTML += `<style class="theming">
    :root {
        --font_main: "${theme.cssvars.font_main}";
        --font_main_light: "${theme.cssvars.font_main_light}";
        --color_r: ${theme.colors.r};
        --color_g: ${theme.colors.g};
        --color_b: ${theme.colors.b};
        --color_black: ${theme.colors.black};
        --color_light_black: ${theme.colors.light_black};
        --color_grey: ${theme.colors.grey};
    }

    body {
        font-family: var(--font_main), sans-serif;
    }

    ${window._purifyCSS(theme.injectCSS || "")}
    </style>`;

    window.theme = theme;
    window.theme.r = theme.colors.r;
    window.theme.g = theme.colors.g;
    window.theme.b = theme.colors.b;
};

function initGraphicalErrorHandling() {
    window.edexErrorsModals = [];
    window.onerror = (msg, path, line, col, error) => {
        let errorModal = new Modal({
            type: "error",
            title: error,
            message: `${msg}<br/>        at ${path}  ${line}:${col}`
        });
        window.edexErrorsModals.push(errorModal);

        ipc.send("log", "error", `${error}: ${msg}`);
        ipc.send("log", "debug", `at ${path} ${line}:${col}`);
    };
}

// Init audio
window.audioManager = new AudioManager();

let i = 0;
if (!window.settings.nointro) {
    displayLine();
} else {
    initGraphicalErrorHandling();
    document.getElementById("boot_screen").remove();
    document.body.setAttribute("class", "");
    if (document.readyState !== "complete" || document.fonts.status !== "loaded") {
        document.addEventListener("readystatechange", () => {
            if (document.readyState === "complete") {
                if (document.fonts.status === "loaded") {
                    initUI();
                } else {
                    document.fonts.onloadingdone = () => {
                        if (document.fonts.status === "loaded") initUI();
                    };
                }
            }
        });
    } else {
        initUI();
    }
}

// Startup boot log
function displayLine() {
    let bootScreen = document.getElementById("boot_screen");
    let log = fs.readFileSync(path.join(__dirname, "assets", "misc", "boot_log.txt")).toString().split('\n');

    function isArchUser() {
        return require("os").platform() === "linux"
                && fs.existsSync("/etc/os-release")
                && fs.readFileSync("/etc/os-release").toString().includes("arch");
    }

    if (log[i] === undefined) {
        setTimeout(resumeInit, 300);
        return;
    }

    if (log[i] === "Boot Complete") {
        window.audioManager.beep2.play();
    } else {
        window.audioManager.beep1.play();
    }
    bootScreen.innerHTML += log[i]+"<br/>";
    i++;

    switch(true) {
        case i === 2:
            bootScreen.innerHTML += `eDEX-UI Kernel version ${electron.remote.app.getVersion()} boot at ${Date().toString()}; root:xnu-1699.22.73~1/RELEASE_X86_64`;
        case i === 4:
            setTimeout(displayLine, 500);
            break;
        case i > 4 && i < 25:
            setTimeout(displayLine, 30);
            break;
        case i === 25:
            setTimeout(displayLine, 400);
            break;
        case i === 42:
            setTimeout(displayLine, 300);
            break;
        case i > 42 && i < 82:
            setTimeout(displayLine, 25);
            break;
        case i === 83:
            if (isArchUser())
                bootScreen.innerHTML += "btw i use arch<br/>";
            setTimeout(displayLine, 25);
            break;
        case i >= log.length-2 && i < log.length:
            setTimeout(displayLine, 300);
            break;
        default:
            setTimeout(displayLine, Math.pow(1 - (i/1000), 3)*25);
    }
}

// Show "logo" and background grid
function resumeInit() {
    let bootScreen = document.getElementById("boot_screen");
    bootScreen.innerHTML = "";
    setTimeout(() => {
        document.body.setAttribute("class", "");
        setTimeout(() => {
            document.body.setAttribute("class", "solidBackground");
            setTimeout(() => {
                document.body.setAttribute("class", "");
            }, 400);
        }, 200);

        window.audioManager.beep4.play();
        bootScreen.setAttribute("class", "center");
        bootScreen.innerHTML = "<h1>eDEX-UI</h1>";
        let title = document.querySelector("section > h1");

        setTimeout(() => {
            title.setAttribute("style", `background-color: rgb(${window.theme.r}, ${window.theme.g}, ${window.theme.b});border-bottom: 5px solid rgb(${window.theme.r}, ${window.theme.g}, ${window.theme.b});`);
            setTimeout(() => {
                window.audioManager.intro.play();
                title.setAttribute("style", `border: 5px solid rgb(${window.theme.r}, ${window.theme.g}, ${window.theme.b});`);
                setTimeout(() => {
                    // Initiate graphical error display
                    initGraphicalErrorHandling();
                    if (document.readyState !== "complete" || document.fonts.status !== "loaded") {
                        document.addEventListener("readystatechange", () => {
                            if (document.readyState === "complete") {
                                if (document.fonts.status === "loaded") {
                                    document.getElementById("boot_screen").remove();
                                    initUI();
                                } else {
                                    document.fonts.onloadingdone = () => {
                                        if (document.fonts.status === "loaded") {
                                            document.getElementById("boot_screen").remove();
                                            initUI();
                                        }
                                    };
                                }
                            }
                        });
                    } else {
                        document.getElementById("boot_screen").remove();
                        initUI();
                    }
                }, 1200);
            }, 600);
        }, 300);
    }, 400);
}

// Create the UI's html structure and initialize the terminal client and the keyboard
function initUI() {
    document.body.innerHTML += `<section class="mod_column" id="mod_column_left">
        <h3 class="title"><p>PANEL</p><p>SYSTEM</p></h3>
    </section>
    <section id="main_shell" style="height:0%;width:0%;opacity:0;margin-bottom:30vh;">
        <h3 class="title" style="opacity:0;"><p>TERMINAL</p><p>MAIN SHELL</p></h3>
        <h1 id="main_shell_greeting"></h1>
    </section>
    <section class="mod_column" id="mod_column_right">
        <h3 class="title"><p>PANEL</p><p>NETWORK</p></h3>
    </section>`;

    setTimeout(() => {
        document.getElementById("main_shell").setAttribute("style", "height:0%;margin-bottom:30vh;");
        setTimeout(() => {
            document.getElementById("main_shell").setAttribute("style", "margin-bottom: 30vh;");
            document.querySelector("#main_shell > h3.title").setAttribute("style", "");
            setTimeout(() => {
                document.getElementById("main_shell").setAttribute("style", "opacity: 0;");
                document.body.innerHTML += `
                <section id="filesystem" style="width: 0px;">
                </section>
                <section id="keyboard" style="opacity:0;">
                </section>`;
                window.keyboard = new Keyboard({
                    layout: path.join(keyboardsDir, settings.keyboard+".json"),
                    container: "keyboard"
                });
                setTimeout(() => {
                    document.getElementById("main_shell").setAttribute("style", "");
                    setTimeout(() => {
                        initGreeter();
                        document.getElementById("filesystem").setAttribute("style", "");
                        document.getElementById("keyboard").setAttribute("style", "");
                        document.getElementById("keyboard").setAttribute("class", "animation_state_1");
                        setTimeout(() => {
                            document.getElementById("keyboard").setAttribute("class", "animation_state_1 animation_state_2");
                            setTimeout(() => {
                                document.getElementById("keyboard").setAttribute("class", "");
                                initMods();
                            }, 1100);
                        }, 100);
                    }, 270);
                }, 10);
            }, 700);
        }, 500);
    }, 10);
}

// A proxy function used to add multithreading to systeminformation calls - see backend process manager @ _multithread.js
function initSystemInformationProxy() {
    const nanoid = require("nanoid/non-secure");

    window.si = new Proxy({}, {
        apply: () => {throw new Error("Cannot use sysinfo proxy directly as a function")},
        set: () => {throw new Error("Cannot set a property on the sysinfo proxy")},
        get: (target, prop, receiver) => {
            return function(...args) {
                let callback = (typeof args[0] === "function") ? true : false;

                return new Promise((resolve, reject) => {
                    let id = nanoid();
                    ipc.once("systeminformation-reply-"+id, (e, res) => {
                        if (callback) {
                            callback(res);
                        }
                        resolve(res);
                    });
                    ipc.send("systeminformation-call", prop, id, ...args);
                });
            };
        }
    });
}

// Create the "mods" in each column
function initMods() {
    window.mods = {};

    initSystemInformationProxy();


    // Left column
    window.mods.clock = new Clock("mod_column_left");
    window.mods.sysinfo = new Sysinfo("mod_column_left");
    window.mods.cpuinfo = new Cpuinfo("mod_column_left");
    window.mods.ramwatcher = new RAMwatcher("mod_column_left");
    window.mods.toplist = new Toplist("mod_column_left");
    window.mods.clipboardButtons = new ClipboardButtons("mod_column_left");

    // Right column
    window.mods.netstat = new Netstat("mod_column_right");
    window.mods.globe = new LocationGlobe("mod_column_right");
    window.mods.conninfo = new Conninfo("mod_column_right");

    // Fade-in animations
    document.querySelectorAll(".mod_column").forEach((e) => {
        e.setAttribute("class", "mod_column activated");
    });

    let i = 0;
    let left = document.querySelectorAll("#mod_column_left > div");
    let right = document.querySelectorAll("#mod_column_right > div");
    let x = setInterval(() => {
        if (!left[i] && !right[i]) {
            clearInterval(x);
        } else {
            if (left[i]) {
                left[i].setAttribute("style", "animation-play-state: running;");
            }
            if (right[i]) {
                right[i].setAttribute("style", "animation-play-state: running;");
            }
            i++;
        }
    }, 500);
}

function initGreeter() {
    let shellContainer = document.getElementById("main_shell");
    let greeter = document.getElementById("main_shell_greeting");

    require("systeminformation").users()
        .then((userlist) => {
            greeter.innerHTML += `Welcome back, <em>${userlist[0].user}</em>`;
        })
        .catch(() => {
            greeter.innerHTML += "Welcome back";
        })
    .then(() => {
        greeter.setAttribute("style", "opacity: 1;");
        setTimeout(() => {
            greeter.setAttribute("style", "opacity: 0;");
            setTimeout(() => {
                greeter.remove();
                setTimeout(() => {
                    shellContainer.innerHTML += `
                        <ul id="main_shell_tabs">
                            <li id="shell_tab0" onclick="window.focusShellTab(0);" class="active">MAIN SHELL</li>
                            <li id="shell_tab1" onclick="window.focusShellTab(1);">EMPTY</li>
                            <li id="shell_tab2" onclick="window.focusShellTab(2);">EMPTY</li>
                            <li id="shell_tab3" onclick="window.focusShellTab(3);">EMPTY</li>
                            <li id="shell_tab4" onclick="window.focusShellTab(4);">EMPTY</li>
                        </ul>
                        <div id="main_shell_innercontainer">
                            <pre id="terminal0" class="active"></pre>
                            <pre id="terminal1"></pre>
                            <pre id="terminal2"></pre>
                            <pre id="terminal3"></pre>
                            <pre id="terminal4"></pre>
                        </div>`;
                    window.term = {
                        0: new Terminal({
                            role: "client",
                            parentId: "terminal0",
                            port: window.settings.port || 3000
                        })
                    };
                    window.currentTerm = 0;
                    window.term[0].onprocesschange = p => {
                        document.getElementById("shell_tab0").innerText = "MAIN - "+p;
                    };
                    // Prevent losing hardware keyboard focus on the terminal when using touch keyboard
                    window.onmouseup = (e) => {
                        window.term[window.currentTerm].term.focus();
                    };

                    window.fsDisp = new FilesystemDisplay({
                        parentId: "filesystem"
                    });

                    setTimeout(() => {
                        document.getElementById("filesystem").setAttribute("style", "opacity: 1;");
                        window.updateCheck = new UpdateChecker();
                    }, 300);
                }, 100);
            }, 500);
        }, 1100);
    });
}

window.themeChanger = (theme) => {
    ipc.send("setThemeOverride", theme);
    setTimeout(() => {
        window.location.reload(true);
    }, 100);
};

window.remakeKeyboard = (layout) => {
    document.getElementById("keyboard").innerHTML = "";
    window.keyboard = new Keyboard({
        layout: path.join(keyboardsDir, layout+".json" || settings.keyboard+".json"),
        container: "keyboard"
    });
    ipc.send("setKbOverride", layout);
};

window.focusShellTab = (number) => {
    if (number !== window.currentTerm && window.term[number]) {
        window.currentTerm = number;

        document.querySelectorAll(`ul#main_shell_tabs > li:not(:nth-child(${number+1}))`).forEach(e => {
            e.setAttribute("class", "");
        });
        document.getElementById("shell_tab"+number).setAttribute("class", "active");

        document.querySelectorAll(`div#main_shell_innercontainer > pre:not(:nth-child(${number+1}))`).forEach(e => {
            e.setAttribute("class", "");
        });
        document.getElementById("terminal"+number).setAttribute("class", "active");

        window.term[number].fit();
        window.term[number].term.focus();
        window.term[number].resendCWD();

        window.fsDisp.followTab();
    } else if (number > 0 && number <= 4 && window.term[number] !== null && typeof window.term[number] !== "object") {
        window.term[number] = null;

        document.getElementById("shell_tab"+number).innerText = "LOADING...";
        ipc.send("ttyspawn", "true");
        ipc.once("ttyspawn-reply", (e, r) => {
            if (r.startsWith("ERROR")) {
                document.getElementById("shell_tab"+number).innerText = "ERROR";
            } else if (r.startsWith("SUCCESS")) {
                let port = Number(r.substr(9));

                window.term[number] = new Terminal({
                    role: "client",
                    parentId: "terminal"+number,
                    port
                });

                window.term[number].onclose = e => {
                    delete window.term[number].onprocesschange;
                    document.getElementById("shell_tab"+number).innerText = "EMPTY";
                    document.getElementById("terminal"+number).innerHTML = "";
                    delete window.term[number];
                    window.focusShellTab(0);
                };

                window.term[number].onprocesschange = p => {
                    document.getElementById("shell_tab"+number).innerText = `#${number+1} - ${p}`;
                };

                document.getElementById("shell_tab"+number).innerText = "::"+port;
                setTimeout(() => {
                    window.focusShellTab(number);
                }, 500);
            }
        });
    }
};

// Global keyboard shortcuts
const globalShortcut = electron.remote.globalShortcut;
globalShortcut.unregisterAll();

function registerKeyboardShortcuts() {
    // Open inspector
    globalShortcut.register("CommandOrControl+Shift+i", () => {
        electron.remote.getCurrentWindow().webContents.toggleDevTools();
    });

    // Copy and paste shortcuts

    if (process.platform === "darwin") {
        // See #342, we have an actual available key on macOS to do this
        globalShortcut.register("Command+C", () => {
            window.term[window.currentTerm].clipboard.copy();
        });
        globalShortcut.register("Command+V", () => {
            window.term[window.currentTerm].clipboard.paste();
        });
    } else {
        // Use Ctrl+shift on other OSs
        globalShortcut.register("Ctrl+Shift+C", () => {
            window.term[window.currentTerm].clipboard.copy();
        });
        globalShortcut.register("Ctrl+Shift+V", () => {
            window.term[window.currentTerm].clipboard.paste();
        });
    }

    // Switch tabs
    // Next
    globalShortcut.register("CommandOrControl+Tab", () => {
        if (window.term[window.currentTerm+1]) {
            window.focusShellTab(window.currentTerm+1);
        } else if (window.term[window.currentTerm+2]) {
            window.focusShellTab(window.currentTerm+2);
        } else if (window.term[window.currentTerm+3]) {
            window.focusShellTab(window.currentTerm+3);
        } else if (window.term[window.currentTerm+4]) {
            window.focusShellTab(window.currentTerm+4);
        } else {
            window.focusShellTab(0);
        }
    });
    // Previous
    globalShortcut.register("CommandOrControl+Shift+Tab", () => {
        if (window.term[window.currentTerm-1]) {
            window.focusShellTab(window.currentTerm-1);
        } else if (window.term[window.currentTerm-2]) {
            window.focusShellTab(window.currentTerm-2);
        } else if (window.term[window.currentTerm-3]) {
            window.focusShellTab(window.currentTerm-3);
        } else if (window.term[window.currentTerm-4]) {
            window.focusShellTab(window.currentTerm-4);
        } else if (window.term[4]){
            window.focusShellTab(4);
        }
    });
    // By tab number
    globalShortcut.register("CommandOrControl+1", () => {
        window.focusShellTab(0);
    });
    globalShortcut.register("CommandOrControl+2", () => {
        window.focusShellTab(1);
    });
    globalShortcut.register("CommandOrControl+3", () => {
        window.focusShellTab(2);
    });
    globalShortcut.register("CommandOrControl+4", () => {
        window.focusShellTab(3);
    });
    globalShortcut.register("CommandOrControl+5", () => {
        window.focusShellTab(4);
    });
}
registerKeyboardShortcuts();

// See #361
window.addEventListener("focus", () => {
    registerKeyboardShortcuts();
});

window.addEventListener("blur", () => {
    globalShortcut.unregisterAll();
});

// Prevent showing menu, exiting fullscreen or app with keyboard shortcuts
window.onkeydown = e => {
    if (e.key === "Alt") {
        e.preventDefault();
    }
    if (e.key === "F11" && !settings.allowWindowed) {
        e.preventDefault();
    }
    if (e.code === "KeyD" && e.ctrlKey) {
        e.preventDefault();
    }
    if (e.code === "KeyA" && e.ctrlKey) {
        e.preventDefault();
    }
};

// Fix double-tap zoom on touchscreens
require('electron').webFrame.setVisualZoomLevelLimits(1, 1);

// Resize terminal with window
window.onresize = () => {
    if (typeof window.currentTerm !== "undefined") {
        if (typeof window.term[window.currentTerm] !== "undefined") {
            window.term[window.currentTerm].fit();
        }
    }
};
