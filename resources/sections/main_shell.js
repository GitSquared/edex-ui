const pty = require('node-pty')
const $ = require('jquery')
const Terminal = require('./../../node_modules/xterm/dist/xterm.js')
const TerminalFit = require('./../../node_modules/xterm/dist/addons/fit/fit.js')

const shell = process.platform === 'win32' ? 'cmd.exe' : 'bash';

function initShell() {
    window.shellDisplay = new Terminal({
        cursorBlink: true,
        scrollback: 1500,
        tabStopWidth: 4
    });
    window.shellDisplay.open(document.getElementById('xterm-container'));

    window.shellDisplay.attachCustomKeydownHandler((e) => {
        switch(e.key) {
            case "Backspace":
                var key = "BACK";
                break;
            case "Tab":
                var key = "TAB";
                break;
            case "Shift":
                var key = "SHIFT";
                break;
            case "Escape":
                var key = "ESC";
                break;
            case "Enter":
                window.exeCommand();
                break;
            case "CapsLock":
                var key = "CAPS";
                break;
            default:
                window.shellProcess.write(e.key);
        }
        return false;
    });

    window.shellProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env
    });

    setTimeout(() => {
        var tmp = TerminalFit.proposeGeometry(window.shellDisplay);
        console.log('Proposed '+tmp.cols+' cols and '+tmp.rows+' rows,');
        tmp.cols = tmp.cols + 2;
        console.log('applied '+tmp.cols+' cols and '+tmp.rows+' rows.');
        window.shellDisplay.resize(tmp.cols, tmp.rows);
        window.shellProcess.resize(tmp.cols, tmp.rows);
    }, 500);

    window.shellProcess.on('data', (data) => {
        window.shellDisplay.write(data);
    });

    window.exeCommand = function() {
        window.shellProcess.write('\r');
        return false;
    }
}
$(() => {
    initShell();
});

$(document).click(function() {
    // Get keyboard focus back on the shell after a click.
    $( ".xterm-helper-textarea" ).focus();
});

$(document).keydown(function (e) {
    // Get keyboard focus back on the shell after a tab.
    if (e.key == "Tab") {
        $( ".xterm-helper-textarea" ).focus();
    }
});
