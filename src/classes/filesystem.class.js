class FilesystemDisplay {
    constructor(opts) {
        if (!opts.parentId) throw "Missing options";

        const fs = require("fs");
        const path = require("path");
        this.cwd = [];
        const container = document.getElementById(opts.parentId);
        container.innerHTML = `
            <h3 class="title"><p>FILESYSTEM</p><p id="fs_disp_title_dir"></p></h3>
            <div id="fs_disp_container">
            </div>`;
        this.filesContainer = document.getElementById("fs_disp_container");
        this.failed = false;
        this._runNextTick = false;

        this._timer = setInterval(() => {
            if (this._runNextTick === true) {
                this._runNextTick = false;
                this.readFS();
            }
        }, 1000);

        this.setFailedState = () => {
            this.failed = true;
            container.innerHTML = `
            <h3 class="title"><p>FILESYSTEM</p><p id="fs_disp_title_dir">EXECUTION FAILED</p></h3>
            <h2 id="fs_disp_error">CANNOT ACCESS CURRENT WORKING DIRECTORY</h2>`;
        };

        window.term.oncwdchange = () => {
            this.readFS();
            this.watchFS();
        };

        this.watchFS = () => {
            if (this._fsWatcher) {
                this._fsWatcher.close();
            }
            this._fsWatcher = fs.watch(window.term.cwd, () => {
                this._runNextTick = true;
            });
        };

        this.readFS = () => {
            if (this.failed === true) return false;
            document.getElementById("fs_disp_title_dir").innerText = window.term.cwd;
            fs.readdir(window.term.cwd, (err, content) => {
                if (err !== null) {
                    this.setFailedState();
                } else {
                    this.cwd = [];
                    this._tmp = {
                        dirs: [],
                        symlinks: [],
                        files: [],
                        others: []
                    };
                    let i = 0;
                    content.forEach(file => {
                        fs.lstat(path.join(window.term.cwd, file), (err, fstat) => {
                            if (fstat.isDirectory()) {
                                this._tmp.dirs.push(file);
                            } else if (fstat.isSymbolicLink()) {
                                this._tmp.symlinks.push(file);
                            } else if (fstat.isFile()) {
                                this._tmp.files.push(file);
                            } else {
                                this._tmp.others.push(file);
                            }

                            i++;
                            if (i === content.length) {
                                if (window.term.cwd !== "/") {
                                    this.cwd.push({
                                        name: "..",
                                        type: "dir"
                                    });
                                }

                                this._tmp.dirs.forEach(e => {
                                    this.cwd.push({
                                        name: this._escapeHtml(e),
                                        type: "dir"
                                    });
                                });
                                this._tmp.symlinks.forEach(e => {
                                    this.cwd.push({
                                        name: this._escapeHtml(e),
                                        type: "symlink"
                                    });
                                });
                                this._tmp.files.forEach(e => {
                                    this.cwd.push({
                                        name: this._escapeHtml(e),
                                        type: "file"
                                    });
                                });
                                this._tmp.others.forEach(e => {
                                    this.cwd.push({
                                        name: this._escapeHtml(e),
                                        type: "other"
                                    });
                                });

                                this.render();
                            }
                        });
                    });
                }
            });
        };

        this.render = () => {
            if (this.failed === true) return false;
            let filesDOM = ``;
            this.cwd.forEach(e => {
                let hidden = "";
                if (e.name.startsWith(".")) {
                    hidden = " hidden";
                }

                let cmd = `window.term.write('${e.name}')`;
                if (e.type === "dir") {
                    cmd = `window.term.writelr('cd ${e.name}')`;
                }

                filesDOM += `<div class="fs_disp_${e.type}${hidden}" onclick="${cmd}">
                                <h3>${e.name}</h3>
                            </div>`;
            });
            this.filesContainer.innerHTML = filesDOM;
        };

        this._escapeHtml = (text) => {
            let map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => {return map[m];});
        };
    }
}
