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

        this.updateList();
        this.listUpdater = setInterval(() => {
            this.updateList();
        }, 2000);
    }
    updateList() {
        window.si.processes().then(data => {
            if (window.settings.excludeThreadsFromToplist === true) {
                data.list = data.list.sort((a, b) => {
                    return (a.pid-b.pid);
                }).filter((e, index, a) => {
                    let i = a.findIndex(x => x.name === e.name);
                    if (i !== -1 && i !== index) {
                        a[i].pcpu = a[i].pcpu+e.pcpu;
                        a[i].pmem = a[i].pmem+e.pmem;
                        return false;
                    }
                    return true;
                });
            }

            let list = data.list.sort((a, b) => {
                return ((b.pcpu-a.pcpu)*100 + b.pmem-a.pmem);
            }).splice(0, 5);

            document.querySelectorAll("#mod_toplist_table > tr").forEach(el => {
                el.remove();
            });
            list.forEach(proc => {
                let el = document.createElement("tr");
                el.innerHTML = `<td>${proc.pid}</td>
                                <td><strong>${proc.name}</strong></td>
                                <td>${Math.round(proc.pcpu*10)/10}%</td>
                                <td>${Math.round(proc.pmem*10)/10}%</td>`;
                document.getElementById("mod_toplist_table").append(el);
            });
        });
    }

    processList(){
        function updateProcessList(){
            window.si.processes().then(data => {
                if (window.settings.excludeThreadsFromToplist === true) {
                    data.list = data.list.sort((a, b) => {
                        return (a.pid-b.pid);
                    }).filter((e, index, a) => {
                        let i = a.findIndex(x => x.name === e.name);
                        if (i !== -1 && i !== index) {
                            a[i].pcpu = a[i].pcpu+e.pcpu;
                            a[i].pmem = a[i].pmem+e.pmem;
                            return false;
                        }
                        return true;
                    });
                }

                let list = data.list.sort((a, b) => {
                    return ((b.pcpu-a.pcpu)*100 + b.pmem-a.pmem);
                }).splice(0, 30);

                document.querySelectorAll("#processList > tr").forEach(el => {
                    el.remove();
                });

                list.forEach(proc => {
                    let runtime = new Date(Date.now() - Date.parse(proc.started));
                    let el = document.createElement("tr");
                    el.innerHTML = `<td>${proc.pid}</td>
                                <td>${proc.name}</td>
                                <td>${proc.user}</td>
                                <td>${Math.round(proc.pcpu*10)/10}%</td>
                                <td>${Math.round(proc.pmem*10)/10}%</td>
                                <td>${proc.state}</td>
                                <td>${proc.started}</td><td>${runtime.getHours()}:${runtime.getMinutes()}:${runtime.getSeconds()}</td>`;
                    document.getElementById("processList").append(el);
                });
            });
        }

        window.keyboard.detach();
        new Modal(
            {
                type: "custom",
                title: "Active Processes",
                html: "<div id=\"processContainer\"><table><thead><tr><td>PID</td><td>Name</td><td>User</td><td>CPU</td><td>Memory</td><td>State</td><td>Started</td><td>Runtime</td></tr></thead><tbody id=\"processList\"></tbody></table></div>",
            }
        );
        updateProcessList();
        window.keyboard.attach();
        window.term[window.currentTerm].term.focus();
        setInterval(updateProcessList, 2000);
    }
}

module.exports = {
    Toplist
};
