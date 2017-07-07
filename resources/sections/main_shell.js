const pty = require('node-pty');
const $ = require('jquery');
const app = require('electron').remote.app;
const Terminal = require('./../../node_modules/xterm/dist/xterm.js');
const TerminalFit = require('./../../node_modules/xterm/dist/addons/fit/fit.js');

const shell = process.platform === 'win32' ? 'cmd.exe' : 'bash';
const lineEnd = process.platform === 'win32' ? '\r\n' : '\n';

initShell = () => {
    window.shellDisplay = new Terminal({
        cursorBlink: true,
        scrollback: 1500,
        tabStopWidth: 4
    });
    window.shellDisplay.open(document.getElementById('xterm-container'));

    window.shellProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env
    });

    app.on('before-quit', () => {
        window.shellProcess.kill();
    });

    setTimeout(() => {
        var tmp = TerminalFit.proposeGeometry(window.shellDisplay);
        console.log('Proposed '+tmp.cols+' cols and '+tmp.rows+' rows,');
        tmp.cols = tmp.cols + 2;
        tmp.rows = tmp.rows - 2;
        console.log('applied '+tmp.cols+' cols and '+tmp.rows+' rows.');
        window.shellDisplay.resize(tmp.cols, tmp.rows);
        window.shellProcess.resize(tmp.cols, tmp.rows);
    }, 500);

    window.shellProcess.on('data', (data) => {
        window.shellDisplay.write(data);
    });

    window.exeCommand = () => {
        window.shellProcess.write(window.command+lineEnd);
        return false;
    }
}
$(() => {
    initShell();
});

$(document).click(() => {
    // Get keyboard focus back on the shell after a click.
    $( ".xterm-helper-textarea" ).focus();
});

$(document).keydown((e) => {
    // Get keyboard focus back on the shell after a tab.
    if (e.key == "Tab") {
        $( ".xterm-helper-textarea" ).focus();
    }
});
