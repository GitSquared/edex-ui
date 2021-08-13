// This is an helper script to generate the resources used by eDEX to display file-specific icons in fsDisp, from a fresh file-icons/source GitHub clone.
// Generated files are:
// - src/assets/icons/file-icons.json: monolithic JSON files containing SVG data needed to draw all the icons.
// - src/assets/misc/file-icons-match.js: script to match filenames to icons by using regex expressions.
//
// The generated files are pretty-printed. See prebuild-minify.js for automatic, on-CI minification of source files before bundling them in binary release assets.

// BEFORE RUNNING THIS SCRIPT:
// - npm run init-file-icons
// You can then use `npm run update-file-icons` which will pull the git submodules and run this script.


const fs = require("fs");
const path = require("path");
const CSON = require("cson-parser");

var fileIconsObject = {};
// Get file icons from fontawesome
fs.readdirSync(path.join(__dirname, "file-icons", "font-awesome", "svgs", "brands")).forEach(icon => {
    let iconName = icon.replace(".svg", "");

    let text = fs.readFileSync(path.join(__dirname, "file-icons", "font-awesome", "svgs", "brands", icon), {encoding: "utf8"});

    let width = text.substr(text.indexOf('viewBox="0 0 ')+13);
    width = Number(width.slice(0, width.indexOf(" ")));
    let height = text.substr(text.indexOf('viewBox="0 0 ')+13+width.toString().length+1);
    height = Number(height.slice(0, height.indexOf('"')));
    let svg = text.substr(text.indexOf(">")+1);
    svg = svg.replace("</svg>", "");

    if (width === null || height === null) console.log(icon);

    fileIconsObject[iconName] = {
        width,
        height,
        svg
    };
});
// Get file icons from file-icons/source
fs.readdirSync(path.join(__dirname, "file-icons", "source", "svg")).forEach(icon => {
    let iconName = icon.toLowerCase().replace(".svg", "").replace("-1", "");

    let text = fs.readFileSync(path.join(__dirname, "file-icons", "source", "svg", icon), {encoding: "utf8"});

    let width = text.substr(text.indexOf('width="')+7);
    width = Number(width.slice(0, width.indexOf("px")));
    let height = text.substr(text.indexOf('height="')+8);
    height = Number(height.slice(0, height.indexOf("px")));
    let svg = text.substr(text.indexOf(">")+1);
    svg = svg.replace("</svg>", "");

    if (width === null || height === null) console.log(icon);

    fileIconsObject[iconName] = {
        width,
        height,
        svg
    };
});
// Get file icons from file-icons/devopicons
fs.readdirSync(path.join(__dirname, "file-icons", "devopicons", "svg")).forEach(icon => {
    if (!icon.endsWith(".svg")) return;
    let iconName = icon.toLowerCase().replace(".svg", "").replace("-1", "");

    let text = fs.readFileSync(path.join(__dirname, "file-icons", "devopicons", "svg", icon), {encoding: "utf8"});

    let width = text.substr(text.indexOf('width="')+7);
    width = Number(width.slice(0, width.indexOf("px")));
    let height = text.substr(text.indexOf('height="')+8);
    height = Number(height.slice(0, height.indexOf("px")));
    let svg = text.substr(text.indexOf(">")+1);
    svg = svg.replace("</svg>", "");

    if (width === null || height === null) console.log(icon);

    fileIconsObject[iconName] = {
        width,
        height,
        svg
    };
});
// Get file icons from file-icons/mfixx
fs.readdirSync(path.join(__dirname, "file-icons", "mfixx", "svg")).forEach(icon => {
    if (!icon.endsWith(".svg")) return;
    let iconName = icon.toLowerCase().replace(".svg", "").replace("-1", "");

    let text = fs.readFileSync(path.join(__dirname, "file-icons", "mfixx", "svg", icon), {encoding: "utf8"});

    let width = text.substr(text.indexOf('width="')+7);
    width = Number(width.slice(0, width.indexOf("px")));
    let height = text.substr(text.indexOf('height="')+8);
    height = Number(height.slice(0, height.indexOf("px")));
    let svg = text.substr(text.indexOf(">")+1);
    svg = svg.replace("</svg>", "");

    if (width === null || height === null) console.log(icon);

    fileIconsObject[iconName] = {
        width,
        height,
        svg
    };
});
// Get file icons from file-icons/bytesize-icons
fs.readdirSync(path.join(__dirname, "file-icons", "bytesize-icons", "dist", "icons")).forEach(icon => {
    if (!icon.endsWith(".svg")) return;
    let iconName = icon.toLowerCase().replace(".svg", "");

    let text = fs.readFileSync(path.join(__dirname, "file-icons", "bytesize-icons", "dist", "icons", icon), {encoding: "utf8"});

    let dimensions = text.match(/viewBox="0 0 (\d+) (\d+)"/);
    let width = dimensions[1];
    let height = dimensions[2];

    let svg = text.substr(text.indexOf(">")+1);
    svg = svg.replace("</svg>", "");

    if (width === null || height === null) console.log(icon);

    fileIconsObject[iconName] = {
        width,
        height,
        svg
    };
});
// Override with eDEX-specific icons
fileIconsObject.showDisks = {
    width: 24,
    height: 24,
    svg: '<path d="M 15.9994,19.9981L 19.9994,19.9981L 19.9994,15.9981L 15.9994,15.9981M 15.9994,13.9981L 19.9994,13.9981L 19.9994,9.99807L 15.9994,9.99807M 9.99938,7.99807L 13.9994,7.99807L 13.9994,3.99807L 9.99938,3.99807M 15.9994,7.99807L 19.9994,7.99807L 19.9994,3.99807L 15.9994,3.99807M 9.99938,13.9981L 13.9994,13.9981L 13.9994,9.99807L 9.99938,9.99807M 3.99938,13.9981L 7.99938,13.9981L 7.99938,9.99807L 3.99938,9.99807M 3.99938,19.9981L 7.99938,19.9981L 7.99938,15.9981L 3.99938,15.9981M 9.99938,19.9981L 13.9994,19.9981L 13.9994,15.9981L 9.99938,15.9981M 3.99938,7.99807L 7.99938,7.99807L 7.99938,3.99807L 3.99938,3.99807L 3.99938,7.99807 Z"/>'
};
fileIconsObject.up = {
    width: 24,
    height: 24,
    svg: '<path d="M 22,4L 14,4L 12,2L 6,2C 4.9,2 4.01,2.9 4.01,4L 4,16C 4,17.1 4.9,18 6,18L 22,18C 23.1,18 24,17.1 24,16L 24,6C 24,4.9 23.1,4 22,4 Z M 2,6L -2.98023e-008,6L -2.98023e-008,11L 0.0100021,11L -2.98023e-008,20C -2.98023e-008,21.1 0.900001,22 2,22L 20,22L 20,20L 2,20L 2,6 Z"/>'
};
fileIconsObject.dir = {
    width: 24,
    height: 24,
    svg: '<path d="M 9.99936,3.99807L 3.99936,3.99807C 2.89436,3.99807 2.00936,4.89406 2.00936,5.99807L 1.99936,17.9981C 1.99936,19.1021 2.89436,19.9981 3.99936,19.9981L 19.9994,19.9981C 21.1029,19.9981 21.9994,19.1021 21.9994,17.9981L 21.9994,7.99807C 21.9994,6.89406 21.1029,5.99807 19.9994,5.99807L 11.9994,5.99807L 9.99936,3.99807 Z"/>'
};
fileIconsObject.symlink = {
    width: 24,
    height: 24,
    svg: '<path d="M 15.9995,5.99817L 12.9995,5.99817L 12.9995,7.89813L 15.9995,7.89813C 18.2635,7.89813 20.0995,9.73413 20.0995,11.9982C 20.0995,14.2621 18.2635,16.0981 15.9995,16.0981L 12.9995,16.0981L 12.9995,17.9982L 15.9995,17.9982C 19.3145,17.9982 21.9995,15.3121 21.9995,11.9982C 21.9995,8.68414 19.3145,5.99817 15.9995,5.99817 Z M 3.89948,11.9982C 3.89948,9.73413 5.7355,7.89813 7.99948,7.89813L 10.9995,7.89813L 10.9995,5.99817L 7.99948,5.99817C 4.68649,5.99817 1.99948,8.68414 1.99948,11.9982C 1.99948,15.3121 4.68649,17.9982 7.99948,17.9982L 10.9995,17.9982L 10.9995,16.0981L 7.99948,16.0981C 5.7355,16.0981 3.89948,14.2621 3.89948,11.9982 Z M 7.99948,12.9982L 15.9995,12.9982L 15.9995,10.9982L 7.99948,10.9982L 7.99948,12.9982 Z"/>'
};
fileIconsObject.file = {
    width: 24,
    height: 24,
    svg: '<path d="M 12.9994,8.99807L 12.9994,3.49807L 18.4994,8.99807M 5.99939,1.99807C 4.89438,1.99807 4.0094,2.89406 4.0094,3.99807L 3.99939,19.9981C 3.99939,21.1021 4.88538,21.9981 5.98938,21.9981L 17.9994,21.9981C 19.1034,21.9981 19.9994,21.1021 19.9994,19.9981L 19.9994,7.99807L 13.9994,1.99807L 5.99939,1.99807 Z"/>'
};
fileIconsObject.other = {
    width: 24,
    height: 24,
    svg: '<path d="M 11,18L 13,18L 13,16L 11,16L 11,18 Z M 12,6C 9.79,6 8,7.79 8,10L 10,10C 10,8.9 10.9,8 12,8C 13.1,8 14,8.9 14,10C 14,12 11,11.75 11,15L 13,15C 13,12.75 16,12.5 16,10C 16,7.79 14.21,6 12,6 Z M 5,3L 19,3C 20.1046,3 21,3.89543 21,5L 21,19C 21,20.1046 20.1046,21 19,21L 5,21C 3.89543,21 3,20.1046 3,19L 3,5C 3,3.89543 3.89543,3 5,3 Z"/>'
};
fileIconsObject.disk = {
    width: 24,
    height: 24,
    svg: '<path d="M 6,2L 18,2C 19.1046,2 20,2.89543 20,4L 20,20C 20,21.1046 19.1046,22 18,22L 6,22C 4.89543,22 4,21.1046 4,20L 4,4C 4,2.89543 4.89543,2 6,2 Z M 12,4.00001C 8.68629,4.00001 5.99999,6.6863 5.99999,10C 5.99999,13.3137 8.68629,16 12.1022,15.9992L 11.2221,13.7674C 10.946,13.2891 11.1099,12.6775 11.5882,12.4013L 12.4542,11.9013C 12.9325,11.6252 13.5441,11.7891 13.8202,12.2674L 15.7446,14.6884C 17.1194,13.5889 18,11.8973 18,10C 18,6.6863 15.3137,4.00001 12,4.00001 Z M 12,9.00001C 12.5523,9.00001 13,9.44773 13,10C 13,10.5523 12.5523,11 12,11C 11.4477,11 11,10.5523 11,10C 11,9.44773 11.4477,9.00001 12,9.00001 Z M 7,18C 6.44771,18 6,18.4477 6,19C 6,19.5523 6.44771,20 7,20C 7.55228,20 8,19.5523 8,19C 8,18.4477 7.55228,18 7,18 Z M 12.0882,13.2674L 14.5757,19.5759L 17.1738,18.0759L 12.9542,12.7674L 12.0882,13.2674 Z"/>'
};
fileIconsObject.rom = {
    width: 24,
    height: 24,
    svg: '<path d="M 11.9975,13.9987C 10.8938,13.9987 10,13.1 10,11.9975C 10,10.8938 10.8938,10 11.9975,10C 13.105,10 13.9987,10.8938 13.9987,11.9975C 13.9987,13.1 13.105,13.9987 11.9975,13.9987 Z M 11.9975,3.99875C 7.5825,3.99875 3.99875,7.5775 3.99875,11.9975C 3.99875,16.4162 7.5825,20 11.9975,20C 16.4163,20 20,16.4162 20,11.9975C 20,7.5775 16.4163,3.99875 11.9975,3.99875 Z"/>'
};
fileIconsObject.usb = {
    width: 24,
    height: 24,
    svg: '<path d="M 14.9994,6.99807L 14.9994,10.9981L 15.9994,10.9981L 15.9994,12.9981L 12.9994,12.9981L 12.9994,4.99807L 14.9994,4.99807L 11.9994,0.998068L 8.9994,4.99807L 10.9994,4.99807L 10.9994,12.9981L 7.9994,12.9981L 7.9994,10.9281C 8.7034,10.5611 9.1994,9.84707 9.1994,8.99807C 9.1994,7.78307 8.2144,6.79807 6.9994,6.79807C 5.7844,6.79807 4.7994,7.78307 4.7994,8.99807C 4.7994,9.84707 5.2954,10.5611 5.9994,10.9281L 5.9994,12.9981C 5.9994,14.1031 6.8934,14.9981 7.9994,14.9981L 10.9994,14.9981L 10.9994,18.0491C 10.2894,18.4141 9.7994,19.1451 9.7994,19.9981C 9.7994,21.2131 10.7844,22.1981 11.9994,22.1981C 13.2144,22.1981 14.1994,21.2131 14.1994,19.9981C 14.1994,19.1451 13.7084,18.4141 12.9994,18.0491L 12.9994,14.9981L 15.9994,14.9981C 17.1044,14.9981 17.9994,14.1031 17.9994,12.9981L 17.9994,10.9981L 18.9994,10.9981L 18.9994,6.99807L 14.9994,6.99807 Z"/>'
};
fileIconsObject.audio = fileIconsObject.volume;
// Write the file
fs.writeFileSync(path.join(__dirname, "src", "assets", "icons", "file-icons.json"), JSON.stringify(fileIconsObject, "", 4));
console.log("Wrote file-icons.json");


var fileIconsMatchScript = `/*
 * Thanks everyone for pointing out this is probably on of the ugliest source code files on GitHub
 * This is script-generated code, however, so it might disqualify
 * See file-icons-generator.js at root dir of git tree
*/
function matchIcon(filename) {\n`;

// Parse the configuration file of file-icons/atom
let atomConfig = CSON.parse(fs.readFileSync(path.join(__dirname, "file-icons", "atom", "config.cson"), {encoding: "utf8"}));
Object.keys(atomConfig.directoryIcons).forEach(key => {
    let config = atomConfig.directoryIcons[key];
    if (config.icon.startsWith("_")) config.icon = config.icon.substr(1);
    if (Array.isArray(config.match)) {
        config.match.forEach(key => {
            let match = key[0];
            if (typeof match === "string") match = new RegExp(match.replace(/\./g, "\\.")+"$", "i"); // lgtm [js/incomplete-sanitization]
            fileIconsMatchScript += `    if (${match}.test(filename)) { return "${config.icon}"; }\n`;
        });
    } else {
        if (typeof config.match === "string") config.match = new RegExp(config.match.replace(/\./g, "\\.")+"$", "i"); // lgtm [js/incomplete-sanitization]
        fileIconsMatchScript += `    if (${config.match}.test(filename)) { return "${config.icon}"; }\n`;

        if (config.alias) {
            if (typeof config.alias === "string") config.alias = new RegExp(config.alias.replace(/\./g, "\\.")+"$", "i"); // lgtm [js/incomplete-sanitization]
            fileIconsMatchScript += `    if (${config.alias}.test(filename)) { return "${config.icon}"; }\n`;
        }
    }
});
Object.keys(atomConfig.fileIcons).forEach(key => {
    let config = atomConfig.fileIcons[key];
    if (config.icon.startsWith("_")) config.icon = config.icon.substr(1);
    if (Array.isArray(config.match)) {
        config.match.forEach(key => {
            let match = key[0];
            if (typeof match === "string") match = new RegExp(match.replace(/\./g, "\\.")+"$", "i"); // lgtm [js/incomplete-sanitization]
            fileIconsMatchScript += `    if (${match}.test(filename)) { return "${config.icon}"; }\n`;
        });
    } else {
        if (typeof config.match === "string") config.match = new RegExp(config.match.replace(/\./g, "\\.")+"$", "i"); // lgtm [js/incomplete-sanitization]
        fileIconsMatchScript += `    if (${config.match}.test(filename)) { return "${config.icon}"; }\n`;

        if (config.alias) {
            if (typeof config.alias === "string") config.alias = new RegExp(config.alias.replace(/\./g, "\\.")+"$", "i"); // lgtm [js/incomplete-sanitization]
            fileIconsMatchScript += `    if (${config.alias}.test(filename)) { return "${config.icon}"; }\n`;
        }
    }
});
// End script
fileIconsMatchScript += "}\nmodule.exports = matchIcon;";
// Write the script
fs.writeFileSync(path.join(__dirname, "src", "assets", "misc", "file-icons-match.js"), fileIconsMatchScript);
console.log("Wrote file-icons-match.js");
