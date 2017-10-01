window.term = new Terminal({
    role: "client",
    parentId: "terminal"
});
setTimeout(() => {
    window.term.fit();
}, 500);

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
