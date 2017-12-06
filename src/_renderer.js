// Load config
let settings = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, "settings.json"), {encoding:"utf-8"}));

let resumeInit, initUI;
let bootScreen = document.getElementById("boot_screen");
let log = require('fs').readFileSync(require('path').join(__dirname, 'assets/misc/boot_log.txt')).toString().split('\n');
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

resumeInit = () => {
    bootScreen.innerHTML = "";
    setTimeout(() => {
        document.body.setAttribute("style", "background: linear-gradient(90deg, #090B0A 20px, transparent 1%) center, linear-gradient(#090B0A 20px, transparent 1%) center, #262827;background-size: 22px 22px;");
        setTimeout(() => {
            document.body.setAttribute("style", "background: #090b0a;");
            setTimeout(() => {
                document.body.setAttribute("style", "background: linear-gradient(90deg, #090B0A 20px, transparent 1%) center, linear-gradient(#090B0A 20px, transparent 1%) center, #262827;background-size: 22px 22px;");
            }, 400);
        }, 200);

        bootScreen.setAttribute("class", "center");
        bootScreen.innerHTML = "<h1>eDEX-UI</h1>";
        let title = document.querySelector("section > h1");

        setTimeout(() => {
            title.setAttribute("style", "background-color: rgba(190, 230, 193, 1);border-bottom: 5px solid rgba(190, 230, 193, 1);");
            setTimeout(() => {
                title.setAttribute("style", "border: 5px solid rgba(190, 230, 193, 1);");
                setTimeout(() => {
                    document.getElementById("boot_screen").remove();
                    initUI();
                }, 1200);
            }, 600);
        }, 300);
    }, 400);
};

initUI = () => {
    document.body.innerHTML += `<section id="main_shell" style="height:0%;width:0%;opacity:0;">
        <pre id="terminal"></pre>
    </section>
    <section id="keyboard" style="opacity:0;">
    </section>`;

    window.keyboard = new Keyboard({
        layout: require("path").join(__dirname, "assets/kb_layouts/"+settings.keyboard+".json"),
        container: "keyboard"
    });
    setTimeout(() => {
        document.getElementById("main_shell").setAttribute("style", "");
        setTimeout(() => {
            document.getElementById("main_shell").setAttribute("style", "opacity: 0;");
            setTimeout(() => {
                document.getElementById("main_shell").setAttribute("style", "");
                setTimeout(() => {
                    window.term = new Terminal({
                        role: "client",
                        parentId: "terminal"
                    });
                    setTimeout(() => {
                        document.getElementById("keyboard").setAttribute("style", "");
                        document.getElementById("keyboard").setAttribute("class", "animation_state_1");
                        setTimeout(() => {
                            document.getElementById("keyboard").setAttribute("class", "animation_state_1 animation_state_2");
                            setTimeout(() => {
                                document.getElementById("keyboard").setAttribute("class", "");
                            }, 1100);
                        }, 100);
                    }, 50);
                }, 260);
            }, 10);
        }, 200);
    }, 10);
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
