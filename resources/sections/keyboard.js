const $ = require('jquery')
const fs = require('fs')
const path = require('path')

const function_keys = ["SHIFT", "ENTER", "CAPS", "TAB", "ESC", "BACK"];

var selected_keyboard = path.join(__dirname, '../keyboards/selected_keyboard.txt');
fs.readFile(selected_keyboard, {encoding: 'utf-8'}, function(err, data) {
    if (!err) {
        var data = data.replace(/\n/g, "");
        console.log('Selected keymap: ' + data);
        var selected_keyboard = path.join(__dirname, '../keyboards/'+data+'.json');
        loadKeyboard(selected_keyboard);
    } else {
        console.log("ERROR: "+err);
    }
});

function loadKeyboard(file) {
    console.log('Loading keyboard file: '+file);
    fs.readFile(file, {encoding: 'utf-8'}, function(err, data) {
        if (!err) {
            var keyboard = JSON.parse(data);
            keyboard.keyboard_numbers.forEach((value, index) => {
                if (contains.call(function_keys, value)) {
                    $( "#keyboard_numbers" ).append('<td class="function_key" onclick="window.pressKey(\''+value+'\', false);">'+value+'</td>');
                } else {
                    $( "#keyboard_numbers" ).append('<td onclick="window.pressKey(\''+value+'\', false);">'+value+'</td>');
                }
            });
            keyboard.keyboard_qwerty.forEach((value, index) => {
                if (contains.call(function_keys, value)) {
                    $( "#keyboard_qwerty" ).append('<td class="function_key" onclick="window.pressKey(\''+value+'\', false);">'+value+'</td>');
                } else {
                    $( "#keyboard_qwerty" ).append('<td onclick="window.pressKey(\''+value+'\', false);">'+value+'</td>');
                }
            });
            keyboard.keyboard_asdfgh.forEach((value, index) => {
                if (contains.call(function_keys, value)) {
                    $( "#keyboard_asdfgh" ).append('<td class="function_key" onclick="window.pressKey(\''+value+'\', false);">'+value+'</td>');
                } else {
                    $( "#keyboard_asdfgh" ).append('<td onclick="window.pressKey(\''+value+'\', false);">'+value+'</td>');
                }
            });
            keyboard.keyboard_zxcvbn.forEach((value, index) => {
                if (contains.call(function_keys, value)) {
                    $( "#keyboard_zxcvbn" ).append('<td class="function_key" onclick="window.pressKey(\''+value+'\', false);">'+value+'</td>');
                } else {
                    $( "#keyboard_zxcvbn" ).append('<td onclick="window.pressKey(\''+value+'\', false);">'+value+'</td>');
                }
            });
            keyboard.keyboard_spacebar.forEach((value, index) => {
                if (contains.call(function_keys, value)) {
                    $( "#keyboard_spacebar" ).append('<td class="function_key" onclick="window.pressKey(\''+value+'\', false);">'+value+'</td>');
                } else {
                    $( "#keyboard_spacebar" ).append('<td onclick="window.pressKey(\''+value+'\', false);">'+value+'</td>');
                }
            });
        } else {
            console.log("ERROR: "+err);
        }
    });
}

window.pressKey = function(key, animate) {
    if (animate == false) {
        if (contains.call(function_keys, key)) {
            switch (key) {
                case "ESC":
                    $( "#shell_input" ).val("exit");
                    window.exeCommand();
                    break;
                case "BACK":
                    var tmp = $( "#shell_input" ).val();
                    tmp = tmp.slice(0, -1);
                    $( "#shell_input" ).val(tmp);
                    break;
                case "ENTER":
                    window.exeCommand();
                    break;
                case "TAB":
                    var tmp = $( "#shell_input" ).val()+"    ";
                    $( "#shell_input" ).val(tmp);
                    break;
                // Need CAPS/SHIFT support
            }
        } else {
            var key = $( "#shell_input" ).val()+key;
            $( "#shell_input" ).val(key);
        }
    } else {
        if (contains.call(function_keys, key)) {
            var key = $( "#keyboard td.function_key:contains('"+key+"')" );
            key.addClass('active');
            setTimeout(function(){key.removeClass('active');},100);
        } else {
            var key = $( "#keyboard td:contains('"+key+"'):not(.function_key)" );
            key.addClass('active');
            setTimeout(function(){key.removeClass('active');},100);
        }
    }
}

// Register keyboard shortcuts
$(document).keydown(function (e) {
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
            var key = "ENTER";
            break;
        case "CapsLock":
            var key = "CAPS";
            break;
        default:
            var key = e.key;
    }
    var key = key.toUpperCase();
    window.pressKey(key, true);
});

var contains=function(needle){var findNaN=needle!==needle;var indexOf;if(!findNaN&&typeof Array.prototype.indexOf==='function'){indexOf=Array.prototype.indexOf}else{indexOf=function(needle){var i=-1,index=-1;for(i=0;i<this.length;i+=1){var item=this[i];if((findNaN&&item!==item)||item===needle){index=i;break}}return index}}return indexOf.call(this,needle)>-1};
