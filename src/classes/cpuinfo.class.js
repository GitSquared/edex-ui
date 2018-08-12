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
            let divide = Math.floor(data.cores/2);

            let innercontainer = document.createElement("div");
            innercontainer.setAttribute("id", "mod_cpuinfo_innercontainer");
            innercontainer.innerHTML = `<h1>CPU USAGE<i>${data.manufacturer} ${data.brand}</i></h1>
                <div>
                    <h1># <em>1</em> - <em>${divide}</em><br>
                    <i>${data.speed}GHz</i></h1>
                    <canvas id="mod_cpuinfo_canvas_0" height="60"></canvas>
                </div>
                <div>
                    <h1># <em>${divide+1}</em> - <em>${data.cores}</em><br>
                    <i>${data.speed}GHz</i></h1>
                    <canvas id="mod_cpuinfo_canvas_1" height="60"></canvas>
                </div>
                <div>
                    <h1>TEMP<br>
                    <i id="mod_cpuinfo_temp">--°C</i></h1>
                    <canvas id="mod_cpuinfo_canvas_2" height="60"></canvas>
                </div>`;
            this.container.append(innercontainer);

            for (var i = 0; i < 2; i++) {
                this.charts.push(new SmoothieChart({
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
                }));
            }

            // temperature chart
            this.charts.push(new SmoothieChart({
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
                    return {min:20,max:120};
                }
            }));

            for (var i = 0; i < data.cores+1; i++) {
                // Create TimeSeries
                this.series.push(new TimeSeries());

                let serie = this.series[i];
                let options = {
                    lineWidth: 1.7,
                    strokeStyle: `rgb(${window.theme.r},${window.theme.g},${window.theme.b})`
                };

                if (i === data.cores) {
                    this.tempSerie = this.series.pop();
                    this.charts[2].addTimeSeries(this.tempSerie, options);
                } else if (i < divide) {
                    this.charts[0].addTimeSeries(serie, options);
                } else {
                    this.charts[1].addTimeSeries(serie, options);
                }
            }

            for (var i = 0; i < 2; i++) {
                this.charts[i].streamTo(document.getElementById(`mod_cpuinfo_canvas_${i}`), 500);
            }
            this.charts[2].streamTo(document.getElementById(`mod_cpuinfo_canvas_${i}`), 2000);

            // Init updater
            this.updateCPUload();
            this.updateCPUtemp();
            this.loadUpdater = setInterval(() => {
                this.updateCPUload();
            }, 500);
            this.tempUpdater = setInterval(() => {
                this.updateCPUtemp();
            }, 2000);
        });
    }
    updateCPUload() {
        this.si.currentLoad((data) => {
            data.cpus.forEach((e, i) => {
                this.series[i].append(new Date().getTime(), e.load);
            });
        });
    }
    updateCPUtemp() {
        this.si.cpuTemperature((data) => {
            this.tempSerie.append(new Date().getTime(), data.main);
            document.getElementById("mod_cpuinfo_temp").innerText = `${data.main}°C`;
        });
    }
}

module.exports = {
    Cpuinfo
};
