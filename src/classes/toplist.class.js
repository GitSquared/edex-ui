class Toplist {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this._element = document.createElement("div");
        this._element.setAttribute("id", "mod_toplist");
        this._element.innerHTML = `<h1>TOP PROCESSES<i>PID | NAME | CPU | MEM</i></h1><br>
        <table id="mod_toplist_table"></table>`;
        this._element.onclick = this.processList;

        this.parent.append(this._element);

        this.currentlyUpdating = false;

        this.updateList();
        this.listUpdater = setInterval(() => {
            this.updateList();
        }, 2000);
    }
    updateList() {
        if (this.currentlyUpdating) return;

        this.currentlyUpdating = true;
        window.si.processes().then(data => {
            if (window.settings.excludeThreadsFromToplist === true) {
                data.list = data.list.sort((a, b) => {
                    return (a.pid-b.pid);
                }).filter((e, index, a) => {
                    let i = a.findIndex(x => x.name === e.name);
                    if (i !== -1 && i !== index) {
                        a[i].cpu = a[i].cpu+e.cpu;
                        a[i].mem = a[i].mem+e.mem;
                        return false;
                    }
                    return true;
                });
            }

            let list = data.list.sort((a, b) => {
                return ((b.cpu-a.cpu)*100 + b.mem-a.mem);
            }).splice(0, 5);

            document.querySelectorAll("#mod_toplist_table > tr").forEach(el => {
                el.remove();
            });
            list.forEach(proc => {
                let el = document.createElement("tr");
                el.innerHTML = `<td>${proc.pid}</td>
                                <td><strong>${proc.name}</strong></td>
                                <td>${Math.round(proc.cpu*10)/10}%</td>
                                <td>${Math.round(proc.mem*10)/10}%</td>`;
                document.getElementById("mod_toplist_table").append(el);
            });
            this.currentlyUpdating = false;
        });
    }

    processList(){
        let sortKey;
        let ascending = false;
        let removed = false;
        let currentlyUpdating = false;

        function setSortKey(fieldName){
            if (sortKey === fieldName){
                if (ascending){
                    sortKey = undefined;
                    ascending = false;
                }
                else{
                    ascending = true;
                }
            }
            else {
                sortKey = fieldName;
                ascending = false;
            }
        }

        function formatRuntime(ms){
            const msInDay = 24 * 60 * 60 * 1000;
            let days = Math.floor(ms / msInDay);
            let remainingMS = ms % msInDay;

            const msInHour = 60 * 60 * 1000;
            let hours = Math.floor(remainingMS / msInHour);
            remainingMS = ms % msInHour;

            let msInMin = 60 * 1000;
            let minutes = Math.floor(remainingMS / msInMin);
            remainingMS = ms % msInMin;

            let seconds = Math.floor(remainingMS / 1000);

            return `${days < 10 ? "0" : ""}${days}:${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        }

        function updateProcessList() {
            if (currentlyUpdating) return;
            currentlyUpdating = true;
            window.si.processes().then(data => {
                if (window.settings.excludeThreadsFromToplist === true) {
                    data.list = data.list.sort((a, b) => {
                        return (a.pid - b.pid);
                    }).filter((e, index, a) => {
                        let i = a.findIndex(x => x.name === e.name);
                        if (i !== -1 && i !== index) {
                            a[i].cpu = a[i].cpu + e.cpu;
                            a[i].mem = a[i].mem + e.mem;
                            return false;
                        }
                        return true;
                    });
                }

                data.list.forEach(proc => {
                    proc.runtime = new Date(Date.now() - Date.parse(proc.started));
                });

                currentlyUpdating = false;
                let list = data.list.sort((a, b) => {
                    switch (sortKey) {
                        case "PID":
                            if (ascending) return a.pid - b.pid;
                            else return b.pid - a.pid;
                        case "Name":
                            if (ascending) {
                                if (a.name > b.name) return -1;
                                if (a.name < b.name) return 1;
                                return 0;
                            }
                            else {
                                if (a.name < b.name) return -1;
                                if (a.name > b.name) return 1;
                                return 0;
                            }
                        case "User":
                            if (ascending) {
                                if (a.user > b.user) return -1;
                                if (a.user < b.user) return 1;
                                return 0;
                            }
                            else {
                                if (a.user < b.user) return -1;
                                if (a.user > b.user) return 1;
                                return 0;
                            }
                        case "CPU":
                            if (ascending) return a.cpu - b.cpu;
                            else return b.cpu - a.cpu;
                        case "Memory":
                            if (ascending) return a.mem - b.mem;
                            else return b.mem - a.mem;
                        case "State":
                            if (a.state < b.state) return -1;
                            if (a.state > b.state) return 1;
                            return 0;
                        case "Started":
                            if (ascending) return Date.parse(a.started) - Date.parse(b.started);
                            else return Date.parse(b.started) - Date.parse(a.started);
                        case "Runtime":
                            if (ascending) return a.runtime - b.runtime;
                            else return b.runtime - a.runtime;
                        default:
                            // default to the same sorting as the toplist
                            return ((b.cpu - a.cpu) * 100 + b.mem - a.mem);
                    }
                });

                if (removed) clearInterval(updateInterval);
                else {
                    document.querySelectorAll("#processList > tr").forEach(el => {
                        el.remove();
                    });

                    list.forEach(proc => {
                        let el = document.createElement("tr");
                        el.innerHTML = `<td class="pid">${proc.pid}</td>
                            <td class="name">${proc.name}</td>
                            <td class="user">${proc.user}</td>
                            <td class="cpu">${Math.round(proc.cpu * 10) / 10}%</td>
                            <td class="mem">${Math.round(proc.mem * 10) / 10}%</td>
                            <td class="state">${proc.state}</td>
                            <td class="started">${proc.started}</td>
                            <td class="runtime">${formatRuntime(proc.runtime)}</td>`;
                        document.getElementById("processList").append(el);
                    });
                }
            });
        }

        window.keyboard.detach();
        new Modal(
            {
                type: "custom",
                title: "Active Processes",
                html: `
<table id=\"processContainer\">
    <thead>
        <tr>
            <td class="pid header">PID</td>
            <td class="name header">Name</td>
            <td class="user header">User</td>
            <td class="cpu header">CPU</td>
            <td class="mem header">Memory</td>
            <td class="state header">State</td>
            <td class="started header">Started</td>
            <td class="runtime header">Runtime</td>
        </tr>
    </thead>
    <tbody id=\"processList\">
    </tbody>
  </table>`,
            },
            () => {
                removed = true;
                //clearInterval(updateInterval);
            }
        );

        let headers = document.getElementsByClassName("header");
        for (let header of headers){
            let title = header.textContent;
            header.addEventListener("click", () => {
                for (let header of headers) {
                    header.textContent = header.textContent.replace('\u25B2', "").replace('\u25BC', "");
                }
                setSortKey(title);
                if (sortKey){
                    header.textContent = `${title}${ascending ? '\u25B2' : '\u25BC'}`;
                }
            });
        }

        updateProcessList();
        window.keyboard.attach();
        window.term[window.currentTerm].term.focus();
        var updateInterval = setInterval(updateProcessList, 1000);
    }
}

module.exports = {
    Toplist
};
