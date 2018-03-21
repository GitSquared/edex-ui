class Cpuinfo {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        this.si = require("systeminformation");

        // Create initial DOM
        this.parent = document.getElementById(parentId);
        this.parent.innerHTML += `<div id="mod_cpuinfo">
        </div>`;
        this.container = document.getElementById("mod_cpuinfo");

        // Init Smoothie
        let TimeSeries = require("smoothie").TimeSeries;
        let SmoothieChart = require("smoothie").SmoothieChart;

        this.series = [];
        this.charts = [];
        this.si.cpu((data) => {
            let createCoresDOM = () => {
                return new Promise((resolve, reject) => {
                    let timeId = setTimeout(reject, 1000); // Fail after 1s
                    let chartsDOM = `<div id="mod_cpuinfo_innercontainer">
                        <h1>CPU USAGE<i>${data.manufacturer} ${data.brand}</i></h1>`;
                    for (var i = 0; i < data.cores; i++) {
                        // Add DOM for each chart
                        chartsDOM += `<div>
                        <h1>CORE <em>#<span>${i}</span></em><br><i>${data.speed}GHz</i></h1>
                        <canvas id="mod_cpuinfo_canvas_${i}" height="60"></canvas>
                        </div>`;

                        if (i === data.cores-1 || i === 3) { // Do not display more than 4 cores, for UX reasons
                            chartsDOM += `</div>`;
                            this.container.innerHTML = chartsDOM;
                            clearTimeout(timeId); // Clear fail timer
                            resolve(true);
                        }
                    }
                });
            };
            async function waitForCoresDOM() {
                let result = createCoresDOM();
                return await result;
            }
            waitForCoresDOM().then(() => {
                for (var i = 0; i < data.cores; i++) {
                    if (i >= 4) return;

                    // Create TimeSeries
                    this.series.push(new TimeSeries());

                    // Create charts
                    let serie = this.series[i];
                    let chart = new SmoothieChart({
                        limitFPS: 30,
                        responsive: true,
                        millisPerPixel: 50,
                        grid:{
                            fillStyle:'transparent',
                            strokeStyle:'transparent',
                            verticalSections:0,
                            borderVisible:false
                        },
                        labels:{
                            disabled: true
                        },
                        yRangeFunction: () => {
                            return {min:0,max:100};
                        }
                    });

                    chart.addTimeSeries(serie, {lineWidth:1.7,strokeStyle:`rgb(${window.theme.r},${window.theme.g},${window.theme.b})`});
                    chart.streamTo(document.getElementById(`mod_cpuinfo_canvas_${i}`), 500);

                    this.charts.push(chart);
                }

                // Init updater
                this.updateInfo();
                this.infoUpdater = setInterval(() => {
                    this.updateInfo();
                }, 500);
            }, () => {
                console.error("[mod_cpuinfo]: Error when creating DOM.");
            });
        });
    }
    updateInfo() {
        this.si.currentLoad((data) => {
            data.cpus.forEach((e, i) => {
                if (i >= 4) return;
                this.series[i].append(new Date().getTime(), e.load);
            });
        });
    }
}

module.exports = {
    Cpuinfo
};
