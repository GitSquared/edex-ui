class Terminal {
    constructor(opts) {
        if (opts.role === "client") {
            if (!opts.parentId) throw "Missing options";

            this.xTerm = require("xterm");
            this.xTerm.loadAddon('attach');
            this.xTerm.loadAddon('fit');

            this.sendSizeToServer = () => {
                let cols = this.term.cols.toString();
                let rows = this.term.rows.toString();
                while (cols.length < 3) {
                    cols = "0"+cols;
                }
                while (rows.length < 3) {
                    rows = "0"+rows;
                }
                this.socket.send("ESCAPED|-- RESIZE:"+cols+";"+rows);
            };

            this.term = new this.xTerm({
                cols: 80,
                rows: 24,
                cursorBlink: false
            });
            this.term.open(document.getElementById(opts.parentId), true);

            let sockHost = opts.host || "127.0.0.1";
            let sockPort = opts.port || 3000;

            this.socket = new WebSocket("ws://"+sockHost+":"+sockPort);
            this.socket.onopen = () => {
                this.term.attach(this.socket);
            };
            this.socket.onerror = (e) => {throw e};

            this.fit = () => {
                this.term.fit();
                setTimeout(() => {
                    this.resize(this.term.cols+1, this.term.rows);
                }, 50);
            };

            this.resize = (cols, rows) => {
                this.term.resize(cols, rows);
                this.sendSizeToServer();
            };
        } else if (opts.role === "server") {

            this.Pty = require("node-pty");
            this.Websocket = require("ws").Server;

            this.onclosed = () => {};
            this.onopened = () => {};
            this.onresize = () => {};
            this.ondisconnected = () => {};

            this.tty = this.Pty.spawn(opts.shell || "bash", [], {
                name: 'xterm-color',
                cols: 80,
                rows: 24,
                cwd: process.env.PWD,
                env: process.env
            });

            this.tty.on('exit', (code, signal) => {
                this.onclosed(code, signal);
            });
            this.wss = new this.Websocket({
                port: opts.port || 3000,
                clientTracking: true,
                verifyClient: (info) => {
                    if (this.wss.clients.length >= 1) {
                        return false;
                    } else {
                        return true;
                    }
                }
            });
            this.wss.on('connection', (ws) => {
                this.onopened();
                ws.on('message', (msg) => {
                    if (msg.startsWith("ESCAPED|-- ")) {
                        if (msg.startsWith("ESCAPED|-- RESIZE:")) {
                            msg = msg.substr(18);
                            let cols = msg.slice(0, -4);
                            let rows = msg.substr(4);
                            this.tty.resize(Number(cols), Number(rows));
                            this.onresized(cols, rows);
                        }
                    } else {
                        this.tty.write(msg);
                    }
                });
                this.tty.on('data', (data) => {
                    try {
                        ws.send(data);
                    } catch (e) {
                        // Websocket closed
                    }
                });
            });
            this.wss.on('close', () => {
                this.ondisconnected();
            });
        } else {
            throw "Unknow purpose";
        }
    }
}

module.exports = {
    Terminal
};
