class RAMwatcher {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

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
                <div id="mod_ramwatcher_swapcontainer">
                    <h1>SWAP</h1>
                    <progress id="mod_ramwatcher_swapbar" max="100" value="0"></progress>
                    <h3 id="mod_ramwatcher_swaptext">0.0 GiB</h3>
                </div>
        </div>`;

        modExtContainer.innerHTML = ramwatcherDOM;
        modExtContainer.setAttribute("id", "mod_ramwatcher");
        this.parent.append(modExtContainer);

        this.points = Array.from(document.querySelectorAll("div.mod_ramwatcher_point"));
        this.shuffleArray(this.points);

        // Init updaters
        this.currentlyUpdating = false;
        this.updateInfo();
        this.infoUpdater = setInterval(() => {
            this.updateInfo();
        }, 1500);
    }
    updateInfo() {
        if (this.currentlyUpdating) return;
        this.currentlyUpdating = true;
        window.si.mem().then(data => {
            if (data.free+data.used !== data.total) throw("RAM Watcher Error: Bad memory values");

            // Convert the data for the 440-points grid
            let active = Math.round((440*data.active)/data.total);
            let available = Math.round((440*(data.available-data.free))/data.total);

            // Update grid
            this.points.slice(0, active).forEach(domPoint => {
                if (domPoint.attributes.class.value !== "mod_ramwatcher_point active") {
                    domPoint.setAttribute("class", "mod_ramwatcher_point active");
                }
            });
            this.points.slice(active, active+available).forEach(domPoint => {
                if (domPoint.attributes.class.value !== "mod_ramwatcher_point available") {
                    domPoint.setAttribute("class", "mod_ramwatcher_point available");
                }
            });
            this.points.slice(active+available, this.points.length).forEach(domPoint => {
                if (domPoint.attributes.class.value !== "mod_ramwatcher_point free") {
                    domPoint.setAttribute("class", "mod_ramwatcher_point free");
                }
            });

            // Update info text
            let totalGiB = Math.round((data.total/1073742000)*10)/10; // 1073742000 bytes = 1 Gibibyte (GiB), the *10 is to round to .1 decimal
            let usedGiB = Math.round((data.active/1073742000)*10)/10;
            document.getElementById("mod_ramwatcher_info").innerText = `USING ${usedGiB} OUT OF ${totalGiB} GiB`;

            // Update swap indicator
            let usedSwap = Math.round((100*data.swapused)/data.swaptotal);
            document.getElementById("mod_ramwatcher_swapbar").value = usedSwap || 0;

            let usedSwapGiB = Math.round((data.swapused/1073742000)*10)/10;
            document.getElementById("mod_ramwatcher_swaptext").innerText = `${usedSwapGiB} GiB`;

            this.currentlyUpdating = false;
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
