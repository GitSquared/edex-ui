class Keyboard {
    constructor(opts) {
        if (!opts.layout || !opts.container) throw "Missing options";

        let ctrlseq = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];

        let layout = JSON.parse(require("fs").readFileSync(opts.layout, {encoding: "utf-8"}));
        Object.keys(layout).forEach((row) => {
            layout[row].forEach((keyObj) => {
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
