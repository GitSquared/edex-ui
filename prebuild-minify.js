const fs = require("fs");
const path = require("path");
const UglifyJS = require("uglify-js");
const minifier = require("minifier");
JSON.minify = require("node-json-minify");

minifier.on("error", (err) => {
    console.log(err);
    throw err;
});

let writeMinified = (path, data) => {
    fs.writeFile(path, data, (err) => {
        if (err) {
            console.log(path+" -  ❌");
            console.log("");
            console.log("");
            throw err;
        };
        console.log(path+" -  ✓");
    });
};

let recursiveMinify = (dirPath) => {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            let filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile()) {
                let tst = filePath.split(".").pop();
                switch (tst) {
                    case "js":
                        // writeMinified(filePath, UglifyJS.minify(fs.readFileSync(filePath, {encoding: "utf-8"})).error);
                        // Commented out, broken for some reason
                        break;
                    case "css":
                        minifier.minify(filePath, {output: filePath});
                        console.log(filePath+" -  ✓");
                        break;
                    case "json":
                        writeMinified(filePath, JSON.minify(fs.readFileSync(filePath, {encoding:"utf-8"})));
                        break;
                }
            } else {
                recursiveMinify(filePath);
            }
        }
    }
};

recursiveMinify(path.join(__dirname, "prebuild-src"));
