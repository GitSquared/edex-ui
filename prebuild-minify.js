const fs = require("fs");
const path = require("path");
const UglifyJS = require("uglify-es");
const CleanCSS = require("clean-css");
JSON.minify = require("node-json-minify");

const writeMinified = (path, data) => {
    fs.writeFile(path, data, (err) => {
        if (err) {
            console.log(path+" -  ❌");
            console.log("");
            console.log("");
            throw err;
        }
        console.log(path+" -  ✓");
    });
};

const recursiveMinify = (dirPath) => {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            let filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile()) {

                // Grid.json is a massive file that's already pre-minified. Do not process.
                if (filePath.endsWith("grid.json")) return;

                switch (filePath.split(".").pop()) {
                    case "js":
                        let minified = UglifyJS.minify(fs.readFileSync(filePath, {encoding: "utf-8"}), {
                            compress: {
                                dead_code: false,
                                unused: false,
                                warnings: true
                            },
                            output: {
                                beautify: false,
                                ecma: 6
                            }
                        });
                        if (!minified.error) {
                            writeMinified(filePath, minified.code);
                            break;
                        }
                        else {
                            console.log(filePath+" -  ❌");
                            console.log("");
                            console.log("");
                            throw minified.error;
                        }
                    case "css":
                        let output = new CleanCSS({level:2}).minify(fs.readFileSync(filePath, {encoding:"utf-8"}));
                        if (output.errors.length >= 1) {
                            console.log(filePath+" -  ❌");
                            console.log("");
                            console.log("");
                            throw output.errors;
                        } else {
                            writeMinified(filePath, output.styles);
                            break;
                        }
                    case "json":
                        try {
                            writeMinified(filePath, JSON.minify(fs.readFileSync(filePath, {encoding:"utf-8"})));
                            break;
                        } catch(err) {
                            console.log(filePath+" -  ❌");
                            console.log("");
                            console.log("");
                            throw err;
                        }
                }
            } else {
                recursiveMinify(filePath);
            }
        }
    }
};

recursiveMinify(path.join(__dirname, "prebuild-src"));
