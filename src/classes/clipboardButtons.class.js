class ClipboardButtons {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this._element = document.createElement("div");
        this._element.setAttribute("id", "mod_clipboardButtons");
        this._element.innerHTML = `<div id="mod_clipboardButtons_inner">
            <h1>CLIPBOARD ACCESS</h1>
            <div>COPY</div>
            <div>PASTE</div>
        </div>`;

        this.parent.append(this._element);

        document.querySelector("div#mod_clipboardButtons_inner > div:nth-child(2)").addEventListener("click", e => {
            window.term[window.currentTerm].clipboard.copy();
        });
        document.querySelector("div#mod_clipboardButtons_inner > div:last-child").addEventListener("click", e => {
            window.term[window.currentTerm].clipboard.paste();
        });
    }
}

module.exports = {
    ClipboardButtons
};
