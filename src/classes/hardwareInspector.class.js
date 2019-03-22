class HardwareInspector {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this._element = document.createElement("div");
        this._element.setAttribute("id", "mod_hardwareInspector");
        this._element.innerHTML = `<div id="mod_hardwareInspector_inner">
            <div>
                <h1>MANUFACTURER</h1>
                <h2 id="mod_hardwareInspector_manufacturer" >NONE</h2>
            </div>
            <div>
                <h1>MODEL</h1>
                <h2 id="mod_hardwareInspector_model" >NONE</h2>
            </div>
            <div>
                <h1>CHASSIS</h1>
                <h2 id="mod_hardwareInspector_chassis" >NONE</h2>
            </div>
        </div>`;

        this.parent.append(this._element);

        this.updateInfo();
        this.infoUpdater = setInterval(() => {
            this.updateInfo();
        }, 20000);
    }
    updateInfo() {
        window.si.system().then(d => {
            window.si.chassis().then(e => {
                document.getElementById("mod_hardwareInspector_manufacturer").innerText = this._trimDataString(d.manufacturer);
                document.getElementById("mod_hardwareInspector_model").innerText = this._trimDataString(d.model, d.manufacturer, e.type);
                document.getElementById("mod_hardwareInspector_chassis").innerText = e.type;
            });
        });
    }
    _trimDataString(str, ...filters) {
        return str.trim().split(" ").filter(word => {
            if (typeof filters !== "object") return true;

            return !filters.includes(word);
        }).slice(0, 2).join(" ");
    }
}

module.exports = {
    HardwareInspector
};
