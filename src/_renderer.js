window.term = new Terminal({
    role: "client",
    parentId: "terminal"
});

window.keyboard = new Keyboard({
    layout: require("path").join(__dirname, "assets/kb_layouts/en-US.json"),
    container: "keyboard"
});


// Prevent showing menu, exiting fullscreen or app with keyboard shortcuts
window.onkeydown = (e) => {
    if (e.key === "Alt" || e.key === "F11") {
        e.preventDefault();
    }
    if (e.code === "KeyD" && e.ctrlKey) {
        e.preventDefault();
    }
    if (e.code === "KeyA" && e.ctrlKey) {
        e.preventDefault();
    }
};
