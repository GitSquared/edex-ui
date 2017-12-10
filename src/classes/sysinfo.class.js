class Sysinfo {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this.parent.innerHTML += `<div id="mod_sysinfo">
            <div>
                <h1>2017</h1>
                <h2>DEC 12</h2>
            </div>
            <div>
                <h1>UPTIME</h1>
                <h2>0:0:47</h2>
            </div>
            <div>
                <h1>SYSTEM</h1>
                <h2>ONLINE</h2>
            </div>
            <div>
                <h1>V</h1>
                <h2>0.1db</h2>
            </div>
        </div>`;

        this.updateDate();
    }
    updateDate() {
        let time = new Date();

        let timeToNewDay = ((24 - time.getHours()) * 3600000) + ((60 - time.getMinutes()) * 60000);
        setTimeout(() => {
            this.updateDate();
        }, timeToNewDay);
    }
}

module.exports = {
    Sysinfo
};
