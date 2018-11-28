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
const childProcess = require('child_process');
const ipc = electron.ipcRenderer;

const settingsDir = electron.remote.app.getPath("userData");
const themesDir = path.join(settingsDir, "themes");
const keyboardsDir = path.join(settingsDir, "keyboards");
const fontsDir = path.join(settingsDir, "fonts");
const settingsFile = path.join(settingsDir, "settings.json");

// Load config
window.settings = require(settingsFile);

// Load UI theme
window._loadTheme = (theme) => {

    if (document.querySelector("style.theming")) {
        document.querySelector("style.theming").remove();
    }

    document.querySelector("head").innerHTML += `<style class="theming">
    @font-face {
        font-family: "${theme.cssvars.font_main}";
        src: url("${path.join(fontsDir, theme.cssvars.font_main.toLowerCase().replace(/ /g, '_')+'.woff2').replace(/\\/g, '/')}") format("woff2");
    }
    @font-face {
        font-family: "${theme.cssvars.font_main_light}";
        src: url("${path.join(fontsDir, theme.cssvars.font_main_light.toLowerCase().replace(/ /g, '_')+'.woff2').replace(/\\/g, '/')}") format("woff2");
    }
    @font-face {
        font-family: "${theme.terminal.fontFamily}";
        src: url("${path.join(fontsDir, theme.terminal.fontFamily.toLowerCase().replace(/ /g, '_')+'.woff2').replace(/\\/g, '/')}") format("woff2");
    }

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

_loadTheme(require(path.join(themesDir, settings.theme+".json")));

// Startup boot log
let resumeInit, initUI, initMods, initGreeter;
let bootScreen = document.getElementById("boot_screen");
let log = fs.readFileSync(path.join(__dirname, 'assets/misc/boot_log.txt')).toString().split('\n');
let i = 0;
displayLine();

function displayLine() {
    function isArchUser() {
        return require("os").platform() === "linux"
                && fs.existsSync("/etc/os-release")
                && fs.readFileSync("/etc/os-release").toString().includes("arch");
    }

    if (log[i] === undefined) {
        setTimeout(resumeInit, 300);
        return;
    }
    bootScreen.innerHTML += log[i]+"<br/>";
    i++;

    switch(true) {
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
resumeInit = () => {
    bootScreen.innerHTML = "";
    setTimeout(() => {
        document.body.setAttribute("class", "");
        setTimeout(() => {
            document.body.setAttribute("class", "solidBackground");
            setTimeout(() => {
                document.body.setAttribute("class", "");
            }, 400);
        }, 200);

        bootScreen.setAttribute("class", "center");
        bootScreen.innerHTML = "<h1>eDEX-UI</h1>";
        let title = document.querySelector("section > h1");

        setTimeout(() => {
            title.setAttribute("style", `background-color: rgb(${window.theme.r}, ${window.theme.g}, ${window.theme.b});border-bottom: 5px solid rgb(${window.theme.r}, ${window.theme.g}, ${window.theme.b});`);
            setTimeout(() => {
                title.setAttribute("style", `border: 5px solid rgb(${window.theme.r}, ${window.theme.g}, ${window.theme.b});`);
                setTimeout(() => {
                    // Initiate graphical error display
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
                    document.getElementById("boot_screen").remove();
                    initUI();
                }, 1200);
            }, 600);
        }, 300);
    }, 400);
};

// Create the UI's html structure and initialize the terminal client and the keyboard
initUI = () => {
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
};

// Create the "mods" in each column
initMods = () => {
    window.mods = {};

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
};

initGreeter = () => {
    let shellContainer = document.getElementById("main_shell");
    let greeter = document.getElementById("main_shell_greeting");

    require("systeminformation").users()
        .then((userlist) => {
            if (process.platform === 'darwin') {
                childProcess.exec(`say Welcome back, ${userlist[0].user}`);
            }
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
};

window.themeChanger = (theme) => {
    for (let i = 1; i <= 4; i++) {
        if (typeof window.term[i] === "object") {
            window.term[i].socket.close();
            delete window.term[i];
            document.getElementById("shell_tab"+i).innerText = "EMPTY";
            document.getElementById("terminal"+i).innerHTML = "";
        }
    }

    let src = path.join(themesDir, theme+".json" || settings.theme+".json");
    // Always get fresh theme files
    delete require.cache[src];

    window.mods.globe.globe.destroy();
    window.removeEventListener("resize", window.mods.globe.resizeHandler);

    window._loadTheme(require(src));
    for (let i; i < 99999; i++) {
        clearInterval(i);
    }
    window.term[window.currentTerm].socket.close();
    delete window.term[window.currentTerm];
    delete window.mods;
    delete window.fsDisp;

    document.getElementById("terminal0").innerHTML = "";
    document.querySelectorAll(".mod_column").forEach((e) => {
        e.setAttribute("class", "mod_column");
    });
    document.querySelectorAll(".mod_column > div").forEach(e => {e.remove()});
    document.querySelectorAll("div.smoothie-chart-tooltip").forEach(e => {e.remove()});

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


    initMods();
    window.fsDisp = new FilesystemDisplay({
        parentId: "filesystem"
    });

    setTimeout(() => {
        window.term[window.currentTerm].fit();
    }, 2700);
};

window.remakeKeyboard = (layout) => {
    document.getElementById("keyboard").innerHTML = "";
    window.keyboard = new Keyboard({
        layout: path.join(keyboardsDir, layout+".json" || settings.keyboard+".json"),
        container: "keyboard"
    });
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

// Switch tabs
// Next
globalShortcut.register("CommandOrControl+Tab", () => {
    console.log("next");
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
    window.term[window.currentTerm].fit();
}
