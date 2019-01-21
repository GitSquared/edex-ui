class Netstat {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this.parent.innerHTML += `<div id="mod_netstat">
            <div id="mod_netstat_inner">
                <h1>NETWORK STATUS<i id="mod_netstat_iname"></i></h1>
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
        this.lastconn = {_ended: true};
        this.iface = null;

        this._httpsAgent = new require("https").Agent({
            keepAlive: false,
            maxSockets: 10
        });

        // Init updaters
        this.updateInfo();
        this.infoUpdater = setInterval(() => {
            this.updateInfo();
        }, 2000);
    }
    updateInfo() {
        window.si.networkInterfaces().then((data) => {
            let offline = false;

            let net = data[0];
            let netID = 0;

            if (typeof window.settings.iface === "string") {
                while (net.iface !== window.settings.iface) {
                    netID++;
                    if (data[netID]) {
                        net = data[netID];
                    } else {
                        // No detected interface has the custom iface name, fallback to automatic detection on next loop
                        window.settings.iface = false;
                        return false;
                    }
                }
            } else {
                // Find the first external, IPv4 connected networkInterface that has a MAC address set

                while (net.internal === true || net.ip4 === "" || net.mac === "") {
                    netID++;
                    if (data[netID]) {
                        net = data[netID];
                    } else {
                        // No external connection!
                        this.iface = null;
                        document.getElementById("mod_netstat_iname").innerText = "Interface: (offline)";

                        this.offline = true;
                        document.querySelector("#mod_netstat_innercontainer > div:first-child > h2").innerHTML = "OFFLINE";
                        document.querySelector("#mod_netstat_innercontainer > div:nth-child(2) > h2").innerHTML = "--.--.--.--";
                        document.querySelector("#mod_netstat_innercontainer > div:nth-child(3) > h2").innerHTML = "--ms";
                        break;
                    }
                }
            }

            this.iface = net.iface;
            this.internalIPv4 = net.ip4;
            document.getElementById("mod_netstat_iname").innerText = "Interface: "+net.iface;

            if (net.ip4 === "127.0.0.1") {
                offline = true;
            } else {
                if (this.lastconn._ended) {
                    this.lastconn = require("https").get({host: "ipinfo.now.sh", port: 443, path: "/", localAddress: net.ip4, agent: this._httpsAgent}, (res) => {
                        let rawData = "";
                        res.on("data", (chunk) => {
                            rawData += chunk;
                        });
                        res.on("end", () => {
                            try {
                                this.ipinfo = JSON.parse(rawData);

                                if (!this.ipinfo.api_version.startsWith("3")) console.warn("Warning: ipinfo API version might not be compatible");

                                delete this.ipinfo.api_version;
                                delete this.ipinfo.time;
                                let ip = this.ipinfo.ip;
                                document.querySelector("#mod_netstat_innercontainer > div:nth-child(2) > h2").innerHTML = ip;
                            } catch(e) {
                                console.warn(e);
                                console.info(rawData.toString());
                                let electron = require("electron");
                                electron.ipcRenderer.send("log", "note", "NetStat: Error parsing data from ipinfo.now.sh");
                                electron.ipcRenderer.send("log", "debug", `Error: ${e}`);
                            }
                        });
                    }).on("error", (e) => {
                        // Drop it
                    });
                }

                window.si.inetLatency(window.settings.pingAddr || "1.1.1.1").then(data => {
                    let ping;
                    if (data === -1) {
                        ping = "--ms";
                        offline = true;
                        window.audioManager.pingFailed.play();
                    } else {
                        ping = Math.round(data)+"ms";
                        window.audioManager.ping.play();
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
