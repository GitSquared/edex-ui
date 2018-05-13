class FilesystemDisplay {
    constructor(opts) {
        if (!opts.parentId) throw "Missing options";

        this.Pty = require("node-pty");
        this.xTerm = require("xterm").Terminal;
        let fitAddon = require("./node_modules/xterm/lib/addons/fit/fit.js");
        this.xTerm.applyAddon(fitAddon);

        this._fsDispCmd = window.settings.fsDispCmd || "ls";
        this._fsDispArgs = this._fsDispCmd.split(" ");
        this._fsDispCmd = this._fsDispArgs[0];
        this._fsDispArgs.splice(0, 1);

        let container = document.getElementById(opts.parentId);
        container.innerHTML = `
            <h3 class="title"><p>FILESYSTEM</p><p id="fs_disp_title_dir"></p></h3>
            <pre id="fs_disp_container">
            </pre>`;

        let color = require("color");
        let colorify = (base, target) => {
            return color(base).grayscale().mix(color(target), 0.3).hex();
        };
        let themeColor = `rgb(${window.theme.r}, ${window.theme.g}, ${window.theme.b})`;

        this.term = new this.xTerm({
            cols: 80,
            rows: 24,
            cursorBlink: false,
            disableStdin: true,
            allowTransparency: window.theme.terminal.allowTransparency || true,
            fontFamily: window.theme.terminal.fontFamily || "Fira Mono",
            fontSize: window.theme.terminal.fontSize || 15,
            fontWeight: window.theme.terminal.fontWeight || "normal",
            fontWeightBold: window.theme.terminal.fontWeightBold || "bold",
            letterSpacing: window.theme.terminal.letterSpacing || 0,
            lineHeight: window.theme.terminal.lineHeight || 1,
            scrollback: 500,
            bellStyle: "none",
            theme: window.term.term.theme
        });
        this.term.open(document.getElementById("fs_disp_container"));
        this.term.fit();
        setTimeout(() => {
            this.term.fit();
            // Fix weird font loading by xterm
            this.term.setOption("fontFamily", window.theme.terminal.fontFamily || "Fira Mono");
        }, 400);

        window.term.oncwdchange = () => {
            document.getElementById("fs_disp_title_dir").innerText = window.term.cwd;
            this.term.clear();

            let lsty = this.Pty.spawn(this._fsDispCmd, this._fsDispArgs, {
                name: "xterm-color",
                cols: this.term.cols,
                rows: this.term.rows,
                cwd: window.term.cwd,
                env: process.env
            });
            lsty.on("data", data => {
                this.term.write(data);
            });
        };
    }
}
