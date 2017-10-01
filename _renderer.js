window.term = new Terminal({
    role: "client",
    parentId: "terminal"
});
setTimeout(() => {
    window.term.fit();
}, 500);

window.keyboard = new Keyboard({
    layout: require("path").join(__dirname, "assets/kb_layouts/EN-us.json"),
    container: "toz"
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
