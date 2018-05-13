class FilesystemDisplay {
    constructor(opts) {
        if (!opts.parentId) throw "Missing options";

        let container = document.getElementById(opts.parentId);
        container.innerHTML = `
            <h3 class="title"><p>FILESYSTEM</p><p>${window.term.cwd}</p></h3>
            <div id="fs_disp_container">
            </div>`;
    }
}
