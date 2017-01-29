const $ = require('jquery')
const fs = require('fs')
const path = require('path')

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
            var function_keys = ["SHIFT", "ENTER", "CAPS", "TAB", "ESC", "BACK"];
            keyboard.keyboard_numbers.forEach((value, index) => {
                if (contains.call(function_keys, value)) {
                    $( "#keyboard_numbers" ).append('<td class="function_key">'+value+'</td>');
                } else {
                    $( "#keyboard_numbers" ).append('<td>'+value+'</td>');
                }
            });
            keyboard.keyboard_qwerty.forEach((value, index) => {
                if (contains.call(function_keys, value)) {
                    $( "#keyboard_qwerty" ).append('<td class="function_key">'+value+'</td>');
                } else {
                    $( "#keyboard_qwerty" ).append('<td>'+value+'</td>');
                }
            });
            keyboard.keyboard_asdfgh.forEach((value, index) => {
                if (contains.call(function_keys, value)) {
                    $( "#keyboard_asdfgh" ).append('<td class="function_key">'+value+'</td>');
                } else {
                    $( "#keyboard_asdfgh" ).append('<td>'+value+'</td>');
                }
            });
            keyboard.keyboard_zxcvhn.forEach((value, index) => {
                if (contains.call(function_keys, value)) {
                    $( "#keyboard_zxcvhn" ).append('<td class="function_key">'+value+'</td>');
                } else {
                    $( "#keyboard_zxcvhn" ).append('<td>'+value+'</td>');
                }
            });
            keyboard.keyboard_spacebar.forEach((value, index) => {
                if (contains.call(function_keys, value)) {
                    $( "#keyboard_spacebar" ).append('<td class="function_key">'+value+'</td>');
                } else {
                    $( "#keyboard_spacebar" ).append('<td>'+value+'</td>');
                }
            });
        } else {
            console.log("ERROR: "+err);
        }
    });
}

var contains=function(needle){var findNaN=needle!==needle;var indexOf;if(!findNaN&&typeof Array.prototype.indexOf==='function'){indexOf=Array.prototype.indexOf}else{indexOf=function(needle){var i=-1,index=-1;for(i=0;i<this.length;i+=1){var item=this[i];if((findNaN&&item!==item)||item===needle){index=i;break}}return index}}return indexOf.call(this,needle)>-1};
