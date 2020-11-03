class OpenPortList {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this._element = document.createElement("div");
        this._element.setAttribute("id", "mod_openportlist");
        this._element.innerHTML = `<h1>OPEN PORTS<i>PID | NAME | PORT</i></h1><br>
        <table id="mod_openportlist_table"></table>`;

        this.parent.append(this._element);

        this.updateList();
        this.listUpdater = setInterval(() => {
            this.updateList();
        }, 2000);
    }

    updateList() {
        // protocol: string;
        // protocol: string;
        // localaddress: string;
        // localport: string;
        // peeraddress: string;
        // peerport: string;
        // state: string;
        // pid: number;
        // process: string;

        window.si.networkConnections().then(data => {
            document.querySelectorAll("#mod_openportlist_table > tr").forEach(el => {
                el.remove();
            });

            data.filter((value, index) => {
                return value.state === 'LISTEN'
            })
                .filter((v, i, a) => a.findIndex(t => (t.localport === v.localport)) === i)
                .forEach(proc => {
                    let el = document.createElement("tr");
                    el.innerHTML = `<td>${proc.pid}</td>
                                <td>${proc.process}</td>
                                <td>${proc.localport}</td>
                                `;
                    document.getElementById("mod_openportlist_table").append(el);
                })
        })
    }
}

module.exports = {
    OpenPortList
};
