const path = require("path");
const fs = require("fs");
const electron = require("electron");

const themesDir = path.join(electron.remote.app.getPath("userData"), "themes");
const keyboardsDir = path.join(electron.remote.app.getPath("userData"), "keyboards");
const fontsDir = path.join(electron.remote.app.getPath("userData"), "fonts");
const settingsFile = path.join(electron.remote.app.getPath("userData"), "settings.json");

// Load config
const settings = require(settingsFile);

// Load UI theme
let theme = require(path.join(themesDir, settings.theme+".json"));

document.querySelector("head").innerHTML += `<style id="theme_${settings.theme}_css">
@font-face {
    font-family: "${theme.cssvars.font_main}";
    src: url("${path.join(fontsDir, theme.cssvars.font_main.toLowerCase().replace(/ /g, '_')+'.woff2')}") format("woff2");
}
@font-face {
    font-family: "${theme.cssvars.font_main_light}";
    src: url("${path.join(fontsDir, theme.cssvars.font_main_light.toLowerCase().replace(/ /g, '_')+'.woff2')}") format("woff2");
}
@font-face {
    font-family: "${theme.terminal.fontFamily}";
    src: url("${path.join(fontsDir, theme.terminal.fontFamily.toLowerCase().replace(/ /g, '_')+'.woff2')}") format("woff2");
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
</style>`;

window.theme = theme;
window.theme.r = theme.colors.r;
window.theme.g = theme.colors.g;
window.theme.b = theme.colors.b;

// Initiate basic error handling
window.onerror = (msg, path, line, col, error) => {
    document.getElementById("boot_screen").innerHTML += `${error} :  ${msg}<br/>==> at ${path}  ${line}:${col}`;
};

// Startup boot log
let resumeInit, initUI, initMods, initGreeter;
let bootScreen = document.getElementById("boot_screen");
let log = fs.readFileSync(path.join(__dirname, 'assets/misc/boot_log.txt')).toString().split('\n');
let i = 0;

let displayLine = () => {
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
        case i > 42 && i < 83:
            setTimeout(displayLine, 25);
            break;
        case i >= 83:
            setTimeout(displayLine, 300);
            break;
        default:
            setTimeout(displayLine, 2);
    }
};
displayLine();

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
    <section id="main_shell" class="greeting" style="height:0%;width:0%;opacity:0;">
        <h3 class="title" style="opacity:0;"><p>TERMINAL</p><p>MAIN SHELL</p></h3>
        <h1 id="main_shell_greeting"></h1>
    </section>
    <section class="mod_column" id="mod_column_right">
        <h3 class="title"><p>PANEL</p><p>NETWORK</p></h3>
    </section>
    <section id="filesystem">
    </section>
    <section id="keyboard" style="opacity:0;">
    </section>`;

    window.keyboard = new Keyboard({
        layout: path.join(keyboardsDir, settings.keyboard+".json"),
        container: "keyboard"
    });
    setTimeout(() => {
        document.getElementById("main_shell").setAttribute("style", "");
        document.querySelector("#main_shell > h3.title").setAttribute("style", "");
        setTimeout(() => {
            document.getElementById("main_shell").setAttribute("style", "opacity: 0;");
            setTimeout(() => {
                document.getElementById("main_shell").setAttribute("style", "");
                setTimeout(() => {
                    initGreeter();

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
        }, 200);
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

    // Right column
    window.mods.netstat = new Netstat("mod_column_right");
    window.mods.conninfo = new Conninfo("mod_column_right");

    document.querySelectorAll(".mod_column").forEach((e) => {
        e.setAttribute("class", "mod_column activated");
    });
};

initGreeter = () => {
    let shellContainer = document.getElementById("main_shell");
    let greeter = document.getElementById("main_shell_greeting");

    require("systeminformation").users()
        .then((userlist) => {
            greeter.innerHTML += `Welcome back, <em>${userlist[0].user}</em>`;
        })
        .catch(() => {
            greeter.innerHTML += `We||//c0m€ _b@-K;; <em>##ERr0r</em>`;
        })
    .then(() => {
        greeter.setAttribute("style", "opacity: 1;");
        setTimeout(() => {
            greeter.setAttribute("style", "opacity: 0;");
            setTimeout(() => {
                greeter.remove();
                setTimeout(() => {
                    shellContainer.innerHTML += `<pre id="terminal"></pre>`;
                    window.term = new Terminal({
                        role: "client",
                        parentId: "terminal"
                    });
                    // Prevent losing hardware keyboard focus on the terminal when using touch keyboard
                    window.onmouseup = (e) => {
                        window.term.term.focus();
                    };

                    window.fsDisp = new FilesystemDisplay({
                        parentId: "filesystem"
                    });
                }, 100);
            }, 500);
        }, 1100);
    });
};

// Prevent showing menu, exiting fullscreen or app with keyboard shortcuts
window.onkeydown = (e) => {
    if (e.key === "Alt" || e.key === "F11") {
        e.preventDefault();
    }
    if (e.code === "KeyD" && e.ctrlKey) {
        e.preventDefault();
    }
    if (e.code === "KeyA" && e.ctrlKey) {
        e.preventDefault();
    }
};
