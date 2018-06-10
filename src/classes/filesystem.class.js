class FilesystemDisplay {
    constructor(opts) {
        if (!opts.parentId) throw "Missing options";

        const fs = require("fs");
        const path = require("path");
        const si = require("systeminformation");
        this.cwd = [];
        this.iconcolor = `rgb(${window.theme.r}, ${window.theme.g}, ${window.theme.b})`;
        this.icons = {
            up: `<path fill="${this.iconcolor}" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 22,4L 14,4L 12,2L 6,2C 4.9,2 4.01,2.9 4.01,4L 4,16C 4,17.1 4.9,18 6,18L 22,18C 23.1,18 24,17.1 24,16L 24,6C 24,4.9 23.1,4 22,4 Z M 2,6L -2.98023e-008,6L -2.98023e-008,11L 0.0100021,11L -2.98023e-008,20C -2.98023e-008,21.1 0.900001,22 2,22L 20,22L 20,20L 2,20L 2,6 Z "/>`,
            dir: `<path fill="${this.iconcolor}" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 9.99936,3.99807L 3.99936,3.99807C 2.89436,3.99807 2.00936,4.89406 2.00936,5.99807L 1.99936,17.9981C 1.99936,19.1021 2.89436,19.9981 3.99936,19.9981L 19.9994,19.9981C 21.1029,19.9981 21.9994,19.1021 21.9994,17.9981L 21.9994,7.99807C 21.9994,6.89406 21.1029,5.99807 19.9994,5.99807L 11.9994,5.99807L 9.99936,3.99807 Z "/>`,
            symlink: `<path fill="${this.iconcolor}" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 15.9995,5.99817L 12.9995,5.99817L 12.9995,7.89813L 15.9995,7.89813C 18.2635,7.89813 20.0995,9.73413 20.0995,11.9982C 20.0995,14.2621 18.2635,16.0981 15.9995,16.0981L 12.9995,16.0981L 12.9995,17.9982L 15.9995,17.9982C 19.3145,17.9982 21.9995,15.3121 21.9995,11.9982C 21.9995,8.68414 19.3145,5.99817 15.9995,5.99817 Z M 3.89948,11.9982C 3.89948,9.73413 5.7355,7.89813 7.99948,7.89813L 10.9995,7.89813L 10.9995,5.99817L 7.99948,5.99817C 4.68649,5.99817 1.99948,8.68414 1.99948,11.9982C 1.99948,15.3121 4.68649,17.9982 7.99948,17.9982L 10.9995,17.9982L 10.9995,16.0981L 7.99948,16.0981C 5.7355,16.0981 3.89948,14.2621 3.89948,11.9982 Z M 7.99948,12.9982L 15.9995,12.9982L 15.9995,10.9982L 7.99948,10.9982L 7.99948,12.9982 Z "/>`,
            file: `<path fill="${this.iconcolor}" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 12.9994,8.99807L 12.9994,3.49807L 18.4994,8.99807M 5.99939,1.99807C 4.89438,1.99807 4.0094,2.89406 4.0094,3.99807L 3.99939,19.9981C 3.99939,21.1021 4.88538,21.9981 5.98938,21.9981L 17.9994,21.9981C 19.1034,21.9981 19.9994,21.1021 19.9994,19.9981L 19.9994,7.99807L 13.9994,1.99807L 5.99939,1.99807 Z "/>`,
            other: `<path fill="${this.iconcolor}" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 11,18L 13,18L 13,16L 11,16L 11,18 Z M 12,6C 9.79,6 8,7.79 8,10L 10,10C 10,8.9 10.9,8 12,8C 13.1,8 14,8.9 14,10C 14,12 11,11.75 11,15L 13,15C 13,12.75 16,12.5 16,10C 16,7.79 14.21,6 12,6 Z M 5,3L 19,3C 20.1046,3 21,3.89543 21,5L 21,19C 21,20.1046 20.1046,21 19,21L 5,21C 3.89543,21 3,20.1046 3,19L 3,5C 3,3.89543 3.89543,3 5,3 Z "/>`,
            edex: {
                theme: `<path fill="${this.iconcolor}" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 17.9994,3.99805L 17.9994,2.99805C 17.9994,2.44604 17.5514,1.99805 16.9994,1.99805L 4.9994,1.99805C 4.4474,1.99805 3.9994,2.44604 3.9994,2.99805L 3.9994,6.99805C 3.9994,7.55005 4.4474,7.99805 4.9994,7.99805L 16.9994,7.99805C 17.5514,7.99805 17.9994,7.55005 17.9994,6.99805L 17.9994,5.99805L 18.9994,5.99805L 18.9994,9.99805L 8.9994,9.99805L 8.9994,20.998C 8.9994,21.55 9.4474,21.998 9.9994,21.998L 11.9994,21.998C 12.5514,21.998 12.9994,21.55 12.9994,20.998L 12.9994,11.998L 20.9994,11.998L 20.9994,3.99805L 17.9994,3.99805 Z "/>`
            }
        };

        const container = document.getElementById(opts.parentId);
        container.innerHTML = `
            <h3 class="title"><p>FILESYSTEM</p><p id="fs_disp_title_dir"></p></h3>
            <div id="fs_disp_container">
            </div>
            <div id="fs_space_bar">
                <h3>Calculating available space...</h3><progress value="100" max="100"></progress>
            </div>`;
        this.filesContainer = document.getElementById("fs_disp_container");
        this.space_bar = {
            text: document.querySelector("#fs_space_bar > h3"),
            bar: document.querySelector("#fs_space_bar > progress")
        };
        this.fsBlock = {};
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
            if (window.term.cwd) {
                this.readFS();
                this.watchFS();
            }
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
            let tcwd = window.term.cwd;
            document.getElementById("fs_disp_title_dir").innerText = tcwd;
            fs.readdir(tcwd, (err, content) => {
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
                        fs.lstat(path.join(tcwd, file), (err, fstat) => {
                            if (err !== null) {
                                this.setFailedState();
                            } else {
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
                                    if (tcwd !== "/") {
                                        this.cwd.push({
                                            name: "..",
                                            type: "up"
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
                                        if (tcwd === themesDir && e.endsWith(".json")) {
                                            this.cwd.push({
                                                name: this._escapeHtml(e),
                                                type: "edex-theme"
                                            });
                                        } else {
                                            this.cwd.push({
                                                name: this._escapeHtml(e),
                                                type: "file"
                                            });
                                        }
                                    });
                                    this._tmp.others.forEach(e => {
                                        this.cwd.push({
                                            name: this._escapeHtml(e),
                                            type: "other"
                                        });
                                    });

                                    si.fsSize(d => {
                                        d.forEach(fsBlock => {
                                            if (tcwd.startsWith(fsBlock.mount)) {
                                                this.fsBlock = fsBlock;
                                            }
                                        });

                                        this.render();
                                    });
                                }
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
                if (e.type === "dir" || e.type === "up") {
                    cmd = `window.term.writelr('cd ${e.name}')`;
                }
                if (e.type === "edex-theme") {
                    cmd = `window.themeChanger('${e.name.slice(0, -5)}')`;
                }

                let icon = "";
                switch(e.type) {
                    case "up":
                        icon = this.icons.up;
                        break;
                    case "dir":
                        icon = this.icons.dir;
                        break;
                    case "symlink":
                        icon = this.icons.symlink;
                        break;
                    case "file":
                        icon = this.icons.file;
                        break;
                    case "edex-theme":
                        icon = this.icons.edex.theme;
                        break;
                    default:
                        icon = this.icons.other;
                        break;
                }

                filesDOM += `<div class="fs_disp_${e.type}${hidden}" onclick="${cmd}">
                                <svg viewBox="0 0 24.00 24.00">${icon}</svg>
                                <h3>${e.name}</h3>
                            </div>`;
            });
            this.filesContainer.innerHTML = filesDOM;

            this.space_bar.text.innerHTML = `Mount <strong>${this.fsBlock.mount}</strong> used <strong>${Math.round(this.fsBlock.use)}%</strong>`;
            this.space_bar.bar.value = Math.round(this.fsBlock.use);
        };
    }
    _escapeHtml(text) {
        let map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => {return map[m];});
    }
}
