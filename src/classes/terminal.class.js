class Terminal {
    constructor(opts) {
        if (opts.role === "client") {
            if (!opts.parentId) throw "Missing options";

            this.xTerm = require("xterm").Terminal;
            this.Ipc = require("electron").ipcRenderer;

            this.port = opts.port || 3000;
            this.cwd = "";
            this.oncwdchange = () => {};

            let attachAddon = require("./node_modules/xterm/lib/addons/attach/attach.js");
            let fitAddon = require("./node_modules/xterm/lib/addons/fit/fit.js");
            this.xTerm.applyAddon(attachAddon);
            this.xTerm.applyAddon(fitAddon);

            this._sendSizeToServer = () => {
                let cols = this.term.cols.toString();
                let rows = this.term.rows.toString();
                while (cols.length < 3) {
                    cols = "0"+cols;
                }
                while (rows.length < 3) {
                    rows = "0"+rows;
                }
                this.Ipc.send("terminal_channel-"+this.port, "Resize", cols, rows);
            };

            let color = require("color");
            let colorify = (base, target) => {
                return color(base).grayscale().mix(color(target), 0.3).hex();
            };
            let themeColor = `rgb(${window.theme.r}, ${window.theme.g}, ${window.theme.b})`;

            this.term = new this.xTerm({
                cols: 80,
                rows: 24,
                cursorBlink: window.theme.terminal.cursorBlink || true,
                cursorStyle: window.theme.terminal.cursorStyle || "block",
                allowTransparency: window.theme.terminal.allowTransparency || false,
                fontFamily: window.theme.terminal.fontFamily || "Fira Mono",
                fontSize: window.theme.terminal.fontSize || 15,
                fontWeight: window.theme.terminal.fontWeight || "normal",
                fontWeightBold: window.theme.terminal.fontWeightBold || "bold",
                letterSpacing: window.theme.terminal.letterSpacing || 0,
                lineHeight: window.theme.terminal.lineHeight || 1,
                scrollback: 1500,
                bellStyle: "none",
                theme: {
                    foreground: window.theme.terminal.foreground,
                    background: window.theme.terminal.background,
                    cursor: window.theme.terminal.cursor,
                    cursorAccent: window.theme.terminal.cursorAccent,
                    selection: window.theme.terminal.selection,
                    black: window.theme.colors.black || colorify("#2e3436", themeColor),
                    red: window.theme.colors.red || colorify("#cc0000", themeColor),
                    green: window.theme.colors.green || colorify("#4e9a06", themeColor),
                    yellow: window.theme.colors.yellow || colorify("#c4a000", themeColor),
                    blue: window.theme.colors.blue || colorify("#3465a4", themeColor),
                    magenta: window.theme.colors.magenta || colorify("#75507b", themeColor),
                    cyan: window.theme.colors.cyan || colorify("#06989a", themeColor),
                    white: window.theme.colors.white || colorify("#d3d7cf", themeColor),
                    brightBlack: window.theme.colors.brightBlack || colorify("#555753", themeColor),
                    brightRed: window.theme.colors.brightRed || colorify("#ef2929", themeColor),
                    brightGreen: window.theme.colors.brightGreen || colorify("#8ae234", themeColor),
                    brightYellow: window.theme.colors.brightYellow || colorify("#fce94f", themeColor),
                    brightBlue: window.theme.colors.brightBlue || colorify("#729fcf", themeColor),
                    brightMagenta: window.theme.colors.brightMagenta || colorify("#ad7fa8", themeColor),
                    brightCyan: window.theme.colors.brightCyan || colorify("#34e2e2", themeColor),
                    brightWhite: window.theme.colors.brightWhite || colorify("#eeeeec", themeColor)
                }
            });
            this.term.open(document.getElementById(opts.parentId));
            this.term.focus();

            this.Ipc.send("terminal_channel-"+this.port, "Renderer startup");
            this.Ipc.on("terminal_channel-"+this.port, (e, ...args) => {
                switch(args[0]) {
                    case "New cwd":
                        this.cwd = args[1];
                        this.oncwdchange(this.cwd);
                        break;
                    case "Fallback cwd":
                        this.cwd = "FALLBACK |-- "+args[1];
                        this.oncwdchange(this.cwd);
                        break;
                    case "New process":
                        if (this.onprocesschange) {
                            this.onprocesschange(args[1]);
                        }
                        break;
                    default:
                        return;
                }
            });
            this.resendCWD = () => {
                this.oncwdchange(this.cwd || null);
            };

            let sockHost = opts.host || "127.0.0.1";
            let sockPort = this.port;

            this.socket = new WebSocket("ws://"+sockHost+":"+sockPort);
            this.socket.onopen = () => {
                this.term.attach(this.socket);
                this.fit();
            };
            this.socket.onerror = e => {throw JSON.stringify(e)};
            this.socket.onclose = e => {
                if (this.onclose) {
                    this.onclose(e);
                }
            };
            this.socket.addEventListener("message", e => {
                window.audioManager.beep1.play();
                if (Date.now() - this.lastRefit > 10000) {
                    this.fit();
                }

                // See #397
                if (!window.settings.experimentalGlobeFeatures) return;
                let ips = e.data.match(/((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g);
                if (ips !== null && ips.length >= 1) {
                    ips = ips.filter((val, index, self) => { return self.indexOf(val) === index; });
                    ips.forEach(ip => {
                        window.mods.globe.addTemporaryConnectedMarker(ip);
                    });
                }
            });

            let parent = document.getElementById(opts.parentId);
            parent.addEventListener("wheel", e => {
                this.term.scrollLines(Math.round(e.deltaY/10));
            });
            this._lastTouchY = null;
            parent.addEventListener("touchstart", e => {
                this._lastTouchY = e.targetTouches[0].screenY;
            });
            parent.addEventListener("touchmove", e => {
                if (this._lastTouchY) {
                    let y = e.changedTouches[0].screenY;
                    let deltaY = y - this._lastTouchY;
                    this._lastTouchY = y;
                    this.term.scrollLines(-Math.round(deltaY/10));
                }
            });
            parent.addEventListener("touchend", e => {
                this._lastTouch = null;
            });
            parent.addEventListener("touchcancel", e => {
                this._lastTouch = null;
            });

            document.querySelector(".xterm-helper-textarea").addEventListener("keydown", e => {
                if (e.key === "F11" && window.settings.allowWindowed) {
                    e.preventDefault();
                    let win = require("electron").remote.BrowserWindow.getFocusedWindow();
                    let bool = (win.isFullScreen() ? false : true);
                    win.setFullScreen(bool);
                }
            });

            this.fit = () => {
                this.lastRefit = Date.now();
                let {cols, rows} = this.term.proposeGeometry();

                // Apply custom fixes based on screen ratio, see #302
                let w = screen.width;
                let h = screen.height;
                let x = 1;
                let y = 0;

                function gcd(a, b) {
                    return (b == 0) ? a : gcd(b, a%b);
                }
                let d = gcd(w, h);

                if (d === 120) y = 1;

                cols = cols+x;
                rows = rows+y;

                if (this.term.cols !== cols || this.term.rows !== rows) {
                    this.resize(cols, rows);
                }
            };

            this.resize = (cols, rows) => {
                this.term.resize(cols, rows);
                this._sendSizeToServer();
            };

            this.write = cmd => {
                this.socket.send(cmd);
            };

            this.writelr = cmd => {
                this.socket.send(cmd+"\r");
            };

            this.clipboard = {
                copy: () => {
                    if (!this.term.hasSelection()) return false;
                    document.execCommand("copy");
                    this.term.clearSelection();
                    this.clipboard.didCopy = true;
                },
                paste: () => {
                    this.Ipc.once("clipboard-reply", (e, txt) => {
                        this.write(txt);
                        this.clipboard.didCopy = false;
                    });
                    this.Ipc.send("clipboard", "read");
                },
                didCopy: false
            };

        } else if (opts.role === "server") {

            this.Pty = require("node-pty");
            this.Websocket = require("ws").Server;
            this.Ipc = require("electron").ipcMain;

            this.renderer = null;
            this.port = opts.port || 3000;

            this._closed = false;
            this.onclosed = () => {};
            this.onopened = () => {};
            this.onresize = () => {};
            this.ondisconnected = () => {};

            this._disableCWDtracking = false;
            this._getTtyCWD = (tty) => {
                return new Promise((resolve, reject) => {
                    let pid = tty._pid;
                    switch(require("os").type()) {
                        case "Linux":
                            require("fs").readlink(`/proc/${pid}/cwd`, (e, cwd) => {
                                if (e !== null) {
                                    reject(e);
                                } else {
                                    resolve(cwd);
                                }
                            });
                            break;
                        case "Darwin":
                            // OK, the following is quite of a hacky solution
                            // Each $XX after the $9 in the awk commands provide support for one more space
                            // character in the path (otherwise it just gets cut)
                            // There's probably a better way to do this, PRs welcome
                            require("child_process").exec(`lsof -a -d cwd -p ${pid} | tail -1 | awk '{print $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20}'`, (e, cwd) => {
                                if (e !== null) {
                                    reject(e);
                                } else {
                                    resolve(cwd.trim());
                                }
                            });
                            break;
                        default:
                            reject("Unsupported OS");
                    }
                });
            };
            this._nextTickUpdateTtyCWD = false;
            this._nextTickUpdateProcess = false;
            this._tick = setInterval(() => {
                if (this._nextTickUpdateTtyCWD && this._disableCWDtracking === false) {
                    this._nextTickUpdateTtyCWD = false;
                    this._getTtyCWD(this.tty).then(cwd => {
                        if (this.tty._cwd === cwd) return;
                        this.tty._cwd = cwd;
                        if (this.renderer) {
                            this.renderer.send("terminal_channel-"+this.port, "New cwd", cwd);
                        }
                    }).catch(e => {
                        if (!this._closed) {
                            console.log("Error while tracking TTY working directory: ", e);
                            this._disableCWDtracking = true;
                            if (this.renderer) {
                                this.renderer.send("terminal_channel-"+this.port, "Fallback cwd", opts.cwd || process.env.PWD);
                            }
                        }
                    });
                }

                if (this.renderer && this._nextTickUpdateProcess) {
                    this.renderer.send("terminal_channel-"+this.port, "New process", this.tty._file);
                    this._nextTickUpdateProcess = false;
                }
            }, 1000);

            this.tty = this.Pty.spawn(opts.shell || "bash", opts.params || [], {
                name: "xterm-color",
                cols: 80,
                rows: 24,
                cwd: opts.cwd || process.env.PWD,
                env: opts.env || process.env
            });

            this.tty.on("exit", (code, signal) => {
                this._closed = true;
                this.onclosed(code, signal);
            });

            this.wss = new this.Websocket({
                port: this.port,
                clientTracking: true,
                verifyClient: (info) => {
                    if (this.wss.clients.length >= 1) {
                        return false;
                    } else {
                        return true;
                    }
                }
            });
            this.Ipc.on("terminal_channel-"+this.port, (e, ...args) => {
                switch(args[0]) {
                    case "Renderer startup":
                        this.renderer = e.sender;
                        if (!this._disableCWDtracking && this.tty._cwd) {
                            this.renderer.send("terminal_channel-"+this.port, "New cwd", this.tty._cwd);
                        }
                        if (this._disableCWDtracking) {
                            this.renderer.send("terminal_channel-"+this.port, "Fallback cwd", opts.cwd || process.env.PWD);
                        }
                        break;
                    case "Resize":
                        let cols = args[1];
                        let rows = args[2];
                        this.tty.resize(Number(cols), Number(rows));
                        this.onresized(cols, rows);
                        break;
                    default:
                        return;
                }
            });
            this.wss.on("connection", (ws) => {
                this.onopened();
                ws.on("close", (code, reason) => {
                    this.ondisconnected(code, reason);
                });
                ws.on("message", (msg) => {
                    this.tty.write(msg);
                });
                this.tty.on("data", (data) => {
                    this._nextTickUpdateTtyCWD = true;
                    this._nextTickUpdateProcess = true;
                    try {
                        ws.send(data);
                    } catch (e) {
                        // Websocket closed
                    }
                });
            });

            this.close = () => {
                this.tty.kill();
                this._closed = true;
            };
        } else {
            throw "Unknown purpose";
        }
    }
}

module.exports = {
    Terminal
};
