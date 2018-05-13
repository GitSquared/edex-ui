window.modals = [];

class Modal {
    constructor(options) {
        if (!options || !options.type) throw "Missing parameters";

        this.type = options.type;
        this.id = window.modals.length;
        this.title = options.title || options.type || "Modal window";
        this.message = options.message || "Lorem ipsum dolor sit amet.";
        let classes = "modal_popup";
        let buttons = [];
        let zindex = 0;

        // Reserve a slot in window.modals
        window.modals[this.id] = {};

        switch(this.type) {
            case "error":
                classes += " error";
                zindex = 1500;
                buttons.push({label:"PANIC", action:"window.modals["+this.id+"].close();"}, {label:"RELOAD", action:"window.location.reload(true);"});
                break;
            case "warning":
                classes += " warning";
                zindex = 1000;
                buttons.push({label:"OK", action:"window.modals["+this.id+"].close();"});
                break;
            default:
                classes += " info";
                zindex = 500;
                buttons.push({label:"OK", action:"window.modals["+this.id+"].close();"});
                break;
        }

        let DOMstring = `<div id="modal_${this.id}" class="${classes}" style="z-index:${zindex+this.id};">
            <h1>${this.title}</h1>
            <h5>${this.message}</h5>
            <div>`;
            buttons.forEach((b) => {
                DOMstring += `<button onclick="${b.action}">${b.label}</button>`;
            });
        DOMstring += `</div>
        </div>`;

        this.close = () => {
            let modalElement = document.getElementById("modal_"+this.id);
            modalElement.setAttribute("class", "modal_popup "+this.type+" blink");
            setTimeout(() => {
                modalElement.remove();
            }, 100);
        };

        let tmp = document.createElement("div");
        tmp.innerHTML = DOMstring;
        let element = tmp.firstChild;


        window.modals[this.id] = this;
        document.body.appendChild(element);
        return this.id;
    }
}

module.exports = {
    Modal
};
