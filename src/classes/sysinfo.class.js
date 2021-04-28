class Sysinfo {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // See #255
        let os;
        switch (require("os").platform()) {
            case "darwin":
                os = "macOS";
                break;
            case "win32":
                os = "win";
                break;
            default:
                os = require("os").platform();
        }

        // Create DOM
        this.parent = document.getElementById(parentId);
        this.parent.innerHTML += `<div id="mod_sysinfo">
            <div>
                <h1>1970</h1>
                <h2>JAN 1</h2>
            </div>
            <div>
                <h1>UPTIME</h1>
                <h2>0:0:0</h2>
            </div>
            <div>
                <h1>TYPE</h1>
                <h2>${os}</h2>
            </div>
            <div>
                <h1>POWER</h1>
                <h2>00%</h2>
            </div>
        </div>`;

        this.updateDate();
        this.updateUptime();
        this.uptimeUpdater = setInterval(() => {
            this.updateUptime();
        }, 60000);
        this.updateBattery();
        this.batteryUpdater = setInterval(() => {
            this.updateBattery();
        }, 3000);
    }
    updateDate() {
        let time = new Date();

        document.querySelector("#mod_sysinfo > div:first-child > h1").innerHTML = time.getFullYear();

        let month = time.getMonth();
        switch(month) {
            case 0:
                month = "JAN";
                break;
            case 1:
                month = "FEB";
                break;
            case 2:
                month = "MAR";
                break;
            case 3:
                month = "APR";
                break;
            case 4:
                month = "MAY";
                break;
            case 5:
                month = "JUN";
                break;
            case 6:
                month = "JUL";
                break;
            case 7:
                month = "AUG";
                break;
            case 8:
                month = "SEP";
                break;
            case 9:
                month = "OCT";
                break;
            case 10:
                month = "NOV";
                break;
            case 11:
                month = "DEC";
                break;
        }
        document.querySelector("#mod_sysinfo > div:first-child > h2").innerHTML = month+" "+time.getDate();

        let timeToNewDay = ((23 - time.getHours()) * 3600000) + ((59 - time.getMinutes()) * 60000);
        setTimeout(() => {
            this.updateDate();
        }, timeToNewDay);
    }
    updateUptime() {
        let uptime = {
            raw: Math.floor(require("os").uptime()),
            days: 0,
            hours: 0,
            minutes: 0
        };

        uptime.days = Math.floor(uptime.raw/86400);
        uptime.raw -= uptime.days*86400;
        uptime.hours = Math.floor(uptime.raw/3600);
        uptime.raw -= uptime.hours*3600;
        uptime.minutes = Math.floor(uptime.raw/60);

        if (uptime.hours.toString().length !== 2) uptime.hours = "0"+uptime.hours;
        if (uptime.minutes.toString().length !== 2) uptime.minutes = "0"+uptime.minutes;

        document.querySelector("#mod_sysinfo > div:nth-child(2) > h2").innerHTML = uptime.days + '<span style="opacity:0.5;">d</span>' + uptime.hours + '<span style="opacity:0.5;">:</span>' + uptime.minutes;
    }
    updateBattery() {
        window.si.battery().then(bat => {
            let indicator = document.querySelector("#mod_sysinfo > div:last-child > h2");
            if (bat.hasBattery) {
                if (bat.isCharging) {
                    indicator.innerHTML = "CHARGE";
                } else if (bat.acConnected) {
                    indicator.innerHTML = "WIRED";
                } else {
                    indicator.innerHTML = bat.percent+"%";
                }
            } else {
                indicator.innerHTML = "ON";
            }
        });
    }
}

module.exports = {
    Sysinfo
};
