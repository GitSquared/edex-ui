const Terminal = require("xterm");
Terminal.loadAddon('attach');

let term = new Terminal();
term.open(document.getElementById("terminal"));
let socket = new WebSocket("ws://0.0.0.0:3000");
socket.onopen = () => {
    term.attach(socket);
};
