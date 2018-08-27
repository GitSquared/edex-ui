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
                theme: `<path fill="${this.iconcolor}" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 17.9994,3.99805L 17.9994,2.99805C 17.9994,2.44604 17.5514,1.99805 16.9994,1.99805L 4.9994,1.99805C 4.4474,1.99805 3.9994,2.44604 3.9994,2.99805L 3.9994,6.99805C 3.9994,7.55005 4.4474,7.99805 4.9994,7.99805L 16.9994,7.99805C 17.5514,7.99805 17.9994,7.55005 17.9994,6.99805L 17.9994,5.99805L 18.9994,5.99805L 18.9994,9.99805L 8.9994,9.99805L 8.9994,20.998C 8.9994,21.55 9.4474,21.998 9.9994,21.998L 11.9994,21.998C 12.5514,21.998 12.9994,21.55 12.9994,20.998L 12.9994,11.998L 20.9994,11.998L 20.9994,3.99805L 17.9994,3.99805 Z "/>`,
                themesDir: `<path fill="${this.iconcolor}" stroke-linejoin="round" d="m9.9994 3.9981h-6c-1.105 0-1.99 0.896-1.99 2l-0.01 12c0 1.104 0.895 2 2 2h16c1.104 0 2-0.896 2-2v-9.9999c0-1.104-0.896-2-2-2h-8l-1.9996-2z" stroke-width=".2"/><path stroke-linejoin="round" d="m18.8 9.3628v-0.43111c0-0.23797-0.19314-0.43111-0.43111-0.43111h-5.173c-0.23797 0-0.43111 0.19313-0.43111 0.43111v1.7244c0 0.23797 0.19314 0.43111 0.43111 0.43111h5.1733c0.23797 0 0.43111-0.19314 0.43111-0.43111v-0.43111h0.43111v1.7244h-4.3111v4.7422c0 0.23797 0.19314 0.43111 0.43111 0.43111h0.86221c0.23797 0 0.43111-0.19314 0.43111-0.43111v-3.879h3.449v-3.4492z" stroke-width=".086221" fill="${window.theme.colors.light_black}"/>`,
                kblayout: `<path fill="${this.iconcolor}" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 18.9994,9.99807L 16.9994,9.99807L 16.9994,7.99807L 18.9994,7.99807M 18.9994,12.9981L 16.9994,12.9981L 16.9994,10.9981L 18.9994,10.9981M 15.9994,9.99807L 13.9994,9.99807L 13.9994,7.99807L 15.9994,7.99807M 15.9994,12.9981L 13.9994,12.9981L 13.9994,10.9981L 15.9994,10.9981M 15.9994,16.9981L 7.99941,16.9981L 7.99941,14.9981L 15.9994,14.9981M 6.99941,9.99807L 4.99941,9.99807L 4.99941,7.99807L 6.99941,7.99807M 6.99941,12.9981L 4.99941,12.9981L 4.99941,10.9981L 6.99941,10.9981M 7.99941,10.9981L 9.99941,10.9981L 9.99941,12.9981L 7.99941,12.9981M 7.99941,7.99807L 9.99941,7.99807L 9.99941,9.99807L 7.99941,9.99807M 10.9994,10.9981L 12.9994,10.9981L 12.9994,12.9981L 10.9994,12.9981M 10.9994,7.99807L 12.9994,7.99807L 12.9994,9.99807L 10.9994,9.99807M 19.9994,4.99807L 3.99941,4.99807C 2.89441,4.99807 2.0094,5.89406 2.0094,6.99807L 1.99941,16.9981C 1.99941,18.1021 2.89441,18.9981 3.99941,18.9981L 19.9994,18.9981C 21.1034,18.9981 21.9994,18.1021 21.9994,16.9981L 21.9994,6.99807C 21.9994,5.89406 21.1034,4.99807 19.9994,4.99807 Z "/>`,
                kblayoutsDir: `<path fill="${this.iconcolor}" stroke-linejoin="round" d="m9.9994 3.9981h-6c-1.105 0-1.99 0.896-1.99 2l-0.01 12c0 1.104 0.895 2 2 2h16c1.104 0 2-0.896 2-2v-9.9999c0-1.104-0.896-2-2-2h-8l-1.9996-2z" stroke-width=".2"/><path stroke-linejoin="round" d="m17.48 11.949h-1.14v-1.14h1.14m0 2.8499h-1.14v-1.14h1.14m-1.7099-0.56999h-1.14v-1.14h1.14m0 2.8499h-1.14v-1.14h1.14m0 3.4199h-4.56v-1.14h4.56m-5.13-2.85h-1.1399v-1.14h1.14m0 2.8499h-1.1399v-1.14h1.14m0.56998 0h1.14v1.14h-1.14m0-2.8499h1.14v1.14h-1.14m1.7099 0.56999h1.14v1.14h-1.14m0-2.8499h1.14v1.14h-1.14m5.13-2.8494h-9.1199c-0.62982 0-1.1343 0.51069-1.1343 1.14l-0.0057 5.6998c0 0.62925 0.51013 1.14 1.14 1.14h9.1196c0.62925 0 1.14-0.5107 1.14-1.14v-5.6998c0-0.62926-0.5107-1.14-1.14-1.14z" stroke-width="0.114" fill="${window.theme.colors.light_black}"/>`,
                settings: `<path fill="${this.iconcolor}" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 11.9994,15.498C 10.0664,15.498 8.49939,13.931 8.49939,11.998C 8.49939,10.0651 10.0664,8.49805 11.9994,8.49805C 13.9324,8.49805 15.4994,10.0651 15.4994,11.998C 15.4994,13.931 13.9324,15.498 11.9994,15.498 Z M 19.4284,12.9741C 19.4704,12.6531 19.4984,12.329 19.4984,11.998C 19.4984,11.6671 19.4704,11.343 19.4284,11.022L 21.5414,9.36804C 21.7294,9.21606 21.7844,8.94604 21.6594,8.73004L 19.6594,5.26605C 19.5354,5.05005 19.2734,4.96204 19.0474,5.04907L 16.5584,6.05206C 16.0424,5.65607 15.4774,5.32104 14.8684,5.06903L 14.4934,2.41907C 14.4554,2.18103 14.2484,1.99805 13.9994,1.99805L 9.99939,1.99805C 9.74939,1.99805 9.5434,2.18103 9.5054,2.41907L 9.1304,5.06805C 8.52039,5.32104 7.95538,5.65607 7.43939,6.05206L 4.95139,5.04907C 4.7254,4.96204 4.46338,5.05005 4.33939,5.26605L 2.33939,8.73004C 2.21439,8.94604 2.26938,9.21606 2.4574,9.36804L 4.5694,11.022C 4.5274,11.342 4.49939,11.6671 4.49939,11.998C 4.49939,12.329 4.5274,12.6541 4.5694,12.9741L 2.4574,14.6271C 2.26938,14.78 2.21439,15.05 2.33939,15.2661L 4.33939,18.73C 4.46338,18.946 4.7254,19.0341 4.95139,18.947L 7.4404,17.944C 7.95639,18.34 8.52139,18.675 9.1304,18.9271L 9.5054,21.577C 9.5434,21.8151 9.74939,21.998 9.99939,21.998L 13.9994,21.998C 14.2484,21.998 14.4554,21.8151 14.4934,21.577L 14.8684,18.9271C 15.4764,18.6741 16.0414,18.34 16.5574,17.9431L 19.0474,18.947C 19.2734,19.0341 19.5354,18.946 19.6594,18.73L 21.6594,15.2661C 21.7844,15.05 21.7294,14.78 21.5414,14.6271L 19.4284,12.9741 Z "/>`
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
        this.dirpath = "";
        this.failed = false;
        this._noTracking = false;
        this._runNextTick = false;

        this._timer = setInterval(() => {
            if (this._runNextTick === true) {
                this._runNextTick = false;
                this.readFS(this.dirpath);
            }
        }, 1000);

        this.setFailedState = () => {
            this.failed = true;
            container.innerHTML = `
            <h3 class="title"><p>FILESYSTEM</p><p id="fs_disp_title_dir">EXECUTION FAILED</p></h3>
            <h2 id="fs_disp_error">CANNOT ACCESS CURRENT WORKING DIRECTORY</h2>`;
        };

        window.term.oncwdchange = (cwd) => {
            if (cwd) {
                if (cwd.startsWith("FALLBACK |-- ")) {
                    this.readFS(cwd.slice(13));
                    this._noTracking = true;
                } else {
                    this.readFS(cwd);
                    this.watchFS(cwd);
                }
            }
        };

        this.watchFS = (dir) => {
            if (this._fsWatcher) {
                this._fsWatcher.close();
            }
            this._fsWatcher = fs.watch(dir, () => {
                this._runNextTick = true;
            });
        };

        this.readFS = (dir) => {
            if (this.failed === true) return false;
            let tcwd = dir;
            fs.readdir(tcwd, (err, content) => {
                if (err !== null) {
                    console.warn(err);
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
                                        if (tcwd === settingsDir && e === "themes") {
                                            this.cwd.push({
                                                name: window._escapeHtml(e),
                                                type: "edex-themesDir"
                                            });
                                        } else if (tcwd === settingsDir && e === "keyboards") {
                                            this.cwd.push({
                                                name: window._escapeHtml(e),
                                                type: "edex-kblayoutsDir"
                                            });
                                        } else {
                                            this.cwd.push({
                                                name: window._escapeHtml(e),
                                                type: "dir"
                                            });
                                        }
                                    });
                                    this._tmp.symlinks.forEach(e => {
                                        this.cwd.push({
                                            name: window._escapeHtml(e),
                                            type: "symlink"
                                        });
                                    });
                                    this._tmp.files.forEach(e => {
                                        if (tcwd === themesDir && e.endsWith(".json")) {
                                            this.cwd.push({
                                                name: window._escapeHtml(e),
                                                type: "edex-theme"
                                            });
                                        } else if (tcwd === keyboardsDir && e.endsWith(".json")) {
                                            this.cwd.push({
                                                name: window._escapeHtml(e),
                                                type: "edex-kblayout"
                                            });
                                        } else if (tcwd === settingsDir && e === "settings.json") {
                                            this.cwd.push({
                                                name: window._escapeHtml(e),
                                                type: "edex-settings"
                                            });
                                        } else {
                                            this.cwd.push({
                                                name: window._escapeHtml(e),
                                                type: "file"
                                            });
                                        }
                                    });
                                    this._tmp.others.forEach(e => {
                                        this.cwd.push({
                                            name: window._escapeHtml(e),
                                            type: "other"
                                        });
                                    });

                                    si.fsSize(d => {
                                        d.forEach(fsBlock => {
                                            if (tcwd.startsWith(fsBlock.mount)) {
                                                this.fsBlock = fsBlock;
                                            }
                                        });

                                        this.dirpath = tcwd;
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

            document.getElementById("fs_disp_title_dir").innerText = this.dirpath;
            if (this._noTracking) {
                document.querySelector("section#filesystem > h3.title > p:first-of-type").innerText = "FILESYSTEM - TRACKING FAILED, RUNNING DETACHED FROM TTY";
            }

            let filesDOM = ``;
            this.cwd.forEach(e => {
                let hidden = "";
                if (e.name.startsWith(".")) {
                    hidden = " hidden";
                }

                let cmd = `window.term.write('${e.name}')`;
                if (e.type === "dir" || e.type === "up" || e.type.endsWith("Dir")) {
                    cmd = `window.term.writelr('cd ${e.name}')`;
                }

                if (e.type === "up" && this._noTracking) {
                    cmd = `window.fsDisp.readFS('${path.resolve(this.dirpath, '..').replace(/\\/g, '\\\\')}')`;
                }
                if ((e.type === "dir" || e.type.endsWith("Dir")) && this._noTracking) {
                    cmd = `window.fsDisp.readFS('${path.resolve(this.dirpath, e.name).replace(/\\/g, '\\\\')}')`;
                }

                if (e.type === "edex-theme") {
                    cmd = `window.themeChanger('${e.name.slice(0, -5)}')`;
                }
                if (e.type === "edex-kblayout") {
                    cmd = `window.remakeKeyboard('${e.name.slice(0, -5)}')`;
                }
                if (e.type === "edex-settings" && process.env.editor) {
                    cmd = `window.term.writelr('${process.env.editor} ${e.name.slice(0, -5)}')`;
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
                    case "edex-kblayout":
                        icon = this.icons.edex.kblayout;
                        break;
                    case "edex-settings":
                        icon = this.icons.edex.settings;
                        break;
                    case "edex-themesDir":
                        icon = this.icons.edex.themesDir;
                        break;
                    case "edex-kblayoutsDir":
                        icon = this.icons.edex.kblayoutsDir;
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
}
