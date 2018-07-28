class Netstat {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        this.si = require("systeminformation");

        // Create DOM
        this.parent = document.getElementById(parentId);
        this.parent.innerHTML += `<div id="mod_netstat">
            <div id="mod_netstat_inner">
                <h1>NETWORK STATUS</h1>
                <div id="mod_netstat_innercontainer">
                    <div>
                        <h1>STATE</h1>
                        <h2>UNKNOWN</h2>
                    </div>
                    <div>
                        <h1>IPv4</h1>
                        <h2>--.--.--.--</h2>
                    </div>
                    <div>
                        <h1>PING</h1>
                        <h2>--ms</h2>
                    </div>
                </div>
            </div>
        </div>`;

        this.offline = false;

        // Init updaters
        this.updateInfo();
        this.infoUpdater = setInterval(() => {
            this.updateInfo();
        }, 1000);
    }
    updateInfo() {
        this.si.networkInterfaces((data) => {
            let offline = false;

            // Find the first external network networkInterface
            let net = data[0];
            let netID = 0;
            while (net.internal === true) {
                netID++;
                if (data[netID] !== undefined) {
                    net = data[netID];
                } else {
                    // No external connection!
                    break;
                }
            }

            if (net.ip4 === "127.0.0.1") {
                offline = true;
            } else {
                require("https").get({"host": "ipinfo.now.sh", "port": 443, "path": "/"}, (res) => {
                    let rawData = "";
                    res.on("data", (chunk) => {
                        rawData += chunk;
                    });
                    res.on("end", () => {
                        try {
                            this.ipinfo = JSON.parse(rawData);
                            let ip = this.ipinfo.ip;
                            document.querySelector("#mod_netstat_innercontainer > div:nth-child(2) > h2").innerHTML = ip;
                        } catch(e) {
                            console.warn(e);
                            console.info(json);
                            let electron = require("electron");
                            electron.ipcRenderer.send("log", "note", "NetStat: Error parsing data from ipinfo.now.sh");
                            electron.ipcRenderer.send("log", "debug", `Error: ${e}`);
                        }
                    });
                }).on("error", (e) => {
                    // Drop it
                });

                this.si.inetLatency("1.1.1.1", (data) => {
                    let ping;
                    if (data === -1) {
                        ping = "--ms";
                        offline = true;
                    } else {
                        ping = Math.round(data)+"ms";
                    }

                    this.offline = offline;
                    if (offline) {
                        document.querySelector("#mod_netstat_innercontainer > div:first-child > h2").innerHTML = "OFFLINE";
                        document.querySelector("#mod_netstat_innercontainer > div:nth-child(2) > h2").innerHTML = "--.--.--.--";
                        document.querySelector("#mod_netstat_innercontainer > div:nth-child(3) > h2").innerHTML = "--ms";
                    } else {
                        document.querySelector("#mod_netstat_innercontainer > div:first-child > h2").innerHTML = "ONLINE";
                        document.querySelector("#mod_netstat_innercontainer > div:nth-child(3) > h2").innerHTML = ping;
                    }
                });
            }
        });
    }
}

module.exports = {
    Netstat
};
