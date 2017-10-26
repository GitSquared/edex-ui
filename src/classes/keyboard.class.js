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
                let key = document.createElement("div");
                key.setAttribute("class", "keyboard_key");

                if (keyObj.cmd === " ") {
                    key.setAttribute("id", "keyboard_spacebar");
                } else if (keyObj.cmd === "\r") {
                    key.setAttribute("id", "keyboard_enter");
                    key.innerHTML = `<h1>${keyObj.name}</h1>`;
                } else {
                    key.innerHTML = `
                        <h1>${keyObj.name || ""}</h1>
                        <h2>${keyObj.shift_name || ""}</h2>
                        <h3>${keyObj.alt_name || ""}</h3>
                        <h4>${keyObj.fn_name || ""}</h4>`;
                }

                Object.keys(keyObj).forEach((property) => {
                    let i = 1;
                    while(i <= ctrlseq.length) {
                        keyObj[property] = keyObj[property].replace("~~~CTRLSEQ"+i+"~~~", ctrlseq[i]);
                        i++;
                    }
                    if (property.endsWith("cmd")) {
                        key.dataset[property] = keyObj[property];
                    }
                });

                document.getElementById(row).append(key);
            });
        });
    }
}

module.exports = {
    Keyboard
};
