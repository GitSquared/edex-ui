class FilesystemDisplay {
    constructor(opts) {
        if (!opts.parentId) throw "Missing options";

        let container = document.getElementById(opts.parentId);
        container.innerHTML = `
            <h3 class="title"><p>FILESYSTEM</p><p id="fs_disp_title_dir"></p></h3>
            <div id="fs_disp_container">
            </div>`;

        window.term.oncwdchange = () => {
            document.getElementById("fs_disp_title_dir").innerText = window.term.cwd;
        };
    }
}
