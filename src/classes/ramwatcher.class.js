class RAMwatcher {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        this.si = require("systeminformation");

        // Create DOM
        this.parent = document.getElementById(parentId);
        let modExtContainer = document.createElement("div");
        let ramwatcherDOM = `<div id="mod_ramwatcher_inner">
                <h1>MEMORY<i id="mod_ramwatcher_info"></i></h1>
                <div id="mod_ramwatcher_pointmap">`;

        for (var i = 0; i < 440; i++) {
            ramwatcherDOM += `<div class="mod_ramwatcher_point free"></div>`;
        }

        ramwatcherDOM += `</div>
        </div>`;

        modExtContainer.innerHTML = ramwatcherDOM;
        modExtContainer.setAttribute("id", "mod_ramwatcher");
        this.parent.append(modExtContainer);

        this.points = Array.from(document.querySelectorAll("div.mod_ramwatcher_point"));
        this.shuffleArray(this.points);

        // Init updaters
        this.updateInfo();
        this.infoUpdater = setInterval(() => {
            this.updateInfo();
        }, 1500);
    }
    updateInfo() {
        this.si.mem((data) => {
            let total = data.free+data.used;
            let free = data.free;
            let available = data.used-data.active;
            let active = data.active;

            if (process.platform === "win32") available = data.available;

            if (free+available+active !== total && process.platform !== "win32") throw("RAM Watcher Error: Bad memory values");
            if (free+data.used !== total && process.platform === "win32") console.warn("RAM Watcher Error: Bad memory values");

            // Convert the data for the 440-points grid
            active = Math.round((440*active)/total);
            available = Math.round((440*available)/total);

            // Update grid
            this.points.slice(0, active).forEach((domPoint) => {
                if (domPoint.attributes.class.value !== "mod_ramwatcher_point active") {
                    domPoint.setAttribute("class", "mod_ramwatcher_point active");
                }
            });
            this.points.slice(active, available).forEach((domPoint) => {
                if (domPoint.attributes.class.value !== "mod_ramwatcher_point available") {
                    domPoint.setAttribute("class", "mod_ramwatcher_point available");
                }
            });
            this.points.slice(available, this.points.length).forEach((domPoint) => {
                if (domPoint.attributes.class.value !== "mod_ramwatcher_point free") {
                    domPoint.setAttribute("class", "mod_ramwatcher_point free");
                }
            });

            // Update info text
            let totalGiB = Math.round((total/1073742000)*2)/2; // 1073742000 bytes = 1 Gibibyte (GiB)
            let usedGiB = Math.round((data.active/1073742000)*2)/2;
            document.getElementById("mod_ramwatcher_info").innerText = `USING ${usedGiB} OUT OF ${totalGiB} GiB`;
        });
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

module.exports = {
    RAMwatcher
};
