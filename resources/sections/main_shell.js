const {ipcRenderer} = require('electron')
const $ = require('jquery')

function initShell() {
    ipcRenderer.send('shell_output_ready', 'null'); // Start shell child process

    ipcRenderer.on('shell_stdout', (event, data) => {
        if (data[0] == 27 && data[1] == 91 && data[2] == 51 && data[3] == 74 && data[4] == 27 && data[5] == 91 && data[6] == 72 && data[7] == 27 && data[8] == 91 && data[9] == 50 && data[10] == 74) { // "clear"
            $( "pre" ).html('');
        } else if(data == '----SHELL RESTART----') {
            $( "pre" ).append("<br><br>---- SHELL RESTART ----<br><br><br>");
        } else {
            $( "pre" ).append(`${data}`);
        }
    });

    window.exeCommand = function() {
        ipcRenderer.send('shell_input', $( "#shell_input" ).val());
        $( "#shell_input" ).val('');
        return false;
    }
}
initShell();

$(document).click(function() {
    // Get keyboard focus back on the shell after a click.
    $( "#shell_input" ).focus();
});

$(document).keydown(function (e) {
    // Get keyboard focus back on the shell after a tab.
    if (e.key == "Tab") {
        $( "#shell_input" ).focus();
    }
});
