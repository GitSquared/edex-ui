window.term = new Terminal({
    role: "client",
    parentId: "terminal"
});
setTimeout(() => {
    window.term.fit();
}, 500);
