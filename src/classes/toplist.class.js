class Toplist {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this._element = document.createElement("div");
        this._element.setAttribute("id", "mod_toplist");
        this._element.innerHTML = `<h1>TOP PROCESSES<i>PID | NAME | CPU | MEM</i></h1><br>
        <table id="mod_toplist_table"></table>`;

        this.parent.append(this._element);

        this.updateList();
        this.listUpdater = setInterval(() => {
            this.updateList();
        }, 5000);
    }
    updateList() {
        window.si.processes().then(data => {
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
}

module.exports = {
    Toplist
};
