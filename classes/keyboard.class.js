class Keyboard {
    constructor(opts) {
        if (!opts.layout || !opts.container) throw "Missing options";

        let ctrlseq = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        let layout = JSON.parse(require("fs").readFileSync(opts.layout, {encoding: "utf-8"}));
        let container = document.getElementById(opts.container);

        // Create DOM
        Object.keys(layout).forEach((row) => {
            container.innerHTML += `<div class="keyboard_row" id="`+row+`"></div>`;
            layout[row].forEach((keyObj) => {
                if (keyObj.cmd === " ") {
                    document.getElementById(row).innerHTML += `<div class="keyboard_key" id="keyboard_spacebar"></div>`;
                } else {
                    let shiftName = keyObj["shift-name"] || "";
                    let altName = keyObj["alt-name"] || "";

                    document.getElementById(row).innerHTML += `
                    <div class="keyboard_key">
                        <h1>`+keyObj.name+`</h1>
                        <h2>`+shiftName+`</h2>
                        <h3>`+altName+`</h3>
                    </div>`;
                }

                Object.keys(keyObj).forEach((property) => {
                    let i = 1;
                    while(i <= ctrlseq.length) {
                        keyObj[property] = keyObj[property].replace("~~~CTRLSEQ"+i+"~~~", ctrlseq[i]);
                        i++;
                    }
                });
            });
        });
    }
}

module.exports = {
    Keyboard
};
