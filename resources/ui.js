// (function () {
//     var $ = require('jquery');
//     var originallog = console.log;
//     console.log = function(txt) {
//         $( "#main_shell > pre" ).append(txt+"<br>");
//         originallog(txt);
//     }
// })();
require('./resources/sections/main_shell.js')
require('./resources/sections/keyboard.js')
