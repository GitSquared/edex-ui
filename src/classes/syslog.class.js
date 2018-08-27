class Syslog {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        const su = require("sudo-prompt");
        const fs = require("fs");
        const {Tail} = require("tail");
        const app = require("electron").remote.app;
        const log_path = `${app.getPath("temp")}/edexui_internal_dmesg.log`;

        // Create DOM
        this.parent = document.getElementById(parentId);
        this._element = document.createElement("div");
        this._element.setAttribute("id", "mod_syslog");
        this._element.innerHTML = `<h1>SYSTEM LOG<i>dmesg -HutPw</i></h1><br>
        <pre></pre>`;

        this.parent.append(this._element);

        if (process.platform === "win32") {
            console.warn("System log display is not supported on windows");
            return;
        }

        fs.writeFileSync(log_path, " ", {encoding: "utf8"});

        this.tail = new Tail(log_path);
        let pending_lines = [];
        let i = 0;
        this.tail.on("line", line => {
            pending_lines.push(line);
            i++;
        });
        this.tail.on("error", err => {
            throw("mod_syslog: "+err);
        });

        su.exec(`dmesg -HutPw > ${log_path}`, {
            name: "eDEX UI Log Display",
            icns: "src/icons/icon.icns"
        }, (err, stdout, stderr) => {
            if (err) throw(err);
        });

        setInterval(() => {
            if (pending_lines.length !== 0) {
                pending_lines.forEach(line => {
                    document.querySelector("div#mod_syslog pre").innerText += line.substr(0, 250)+"\n";
                });
                pending_lines = [];
            }
        }, 1000);

        setInterval(() => {
            if (i > 7) {
                fs.readFile(log_path, {encoding: "utf8"}, (err, data) => {
                    if (err) return;
                    fs.writeFile(log_path, data.toString().split("\n").slice(-7).join("\n"), (err) => {
                        if (err) throw(err);
                    });
                });
                let dom = document.querySelector("div#mod_syslog pre");
                dom.innerText = dom.innerText.split("\n").slice(-7).join("\n");
                i = 0;
            }
        }, 3000);
    }
}

module.exports = {
    Syslog
};
