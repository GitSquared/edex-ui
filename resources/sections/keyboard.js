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
            keyboard.keyboard_numbers.forEach((value, index) => {
                $( "#keyboard_numbers" ).append('<td>'+value+'</td>');
            });
            keyboard.keyboard_qwerty.forEach((value, index) => {
                $( "#keyboard_qwerty" ).append('<td>'+value+'</td>');
            });
            keyboard.keyboard_asdfgh.forEach((value, index) => {
                $( "#keyboard_asdfgh" ).append('<td>'+value+'</td>');
            });
            keyboard.keyboard_zxcvhn.forEach((value, index) => {
                $( "#keyboard_zxcvhn" ).append('<td>'+value+'</td>');
            });
            keyboard.keyboard_spacebar.forEach((value, index) => {
                $( "#keyboard_spacebar" ).append('<td>'+value+'</td>');
            });
        } else {
            console.log("ERROR: "+err);
        }
    });
}
