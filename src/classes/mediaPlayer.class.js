class MediaPlayer {
    constructor(opts) {
        const modalElementId = "modal_" + opts.modalId;
        const type = opts.type;
        const icons = require("./assets/icons/file-icons.json");
        const iconcolor = `rgb(${window.theme.r}, ${window.theme.g}, ${window.theme.b})`;
        const mediaContainer = document.getElementById(modalElementId).querySelector(".media_container");
        const media = document.getElementById(modalElementId).querySelector(type);
        const mediaControls = document.getElementById(modalElementId).querySelector(".media_controls");
        const playpause = document.getElementById(modalElementId).querySelector(".playpause");
        const volumeIcon = document.getElementById(modalElementId).querySelector(".volume_icon");
        const volume = document.getElementById(modalElementId).querySelector(".volume");
        const volumeBar = document.getElementById(modalElementId).querySelector(".volume_bar");
        const progress = document.getElementById(modalElementId).querySelector(".progress");
        const progressBar = document.getElementById(modalElementId).querySelector(".progress_bar");
        const fullscreen = document.getElementById(modalElementId).querySelector(".fs");
        const mediaTime = document.getElementById(modalElementId).querySelector(".media_time");

        let volumeDrag = false;
        let fullscreenVisible = true;
        let fullscreenTimeout;
        media.controls = false;
        mediaControls.setAttribute("data-state", "visible");

        this.changeButtonState = (type) => {
            if (media.paused || media.ended) {
                playpause.setAttribute("data-state", "play");
                playpause.innerHTML = `
                    <svg viewBox="0 0 ${icons["play"].width} ${icons["play"].height}" fill="${iconcolor}">
                        ${icons["play"].svg}
                    </svg>`;
            } else {
                playpause.setAttribute("data-state", "pause");
                playpause.innerHTML = `
                    <svg viewBox="0 0 ${icons["pause"].width} ${icons["pause"].height}" fill="${iconcolor}">
                        ${icons["pause"].svg}
                    </svg>`;
            }
        };

        this.setFullscreenData = (state) => {
            if (fullscreen === null) { return; }
            mediaContainer.setAttribute("data-fullscreen", !!state);
            fullscreen.setAttribute("data-state", !!state ? "cancel-fullscreen" : "go-fullscreen");
            const buttonIcon = !!state ? "fullscreen-exit" : "fullscreen";
            fullscreen.innerHTML = `
                <svg viewBox="0 0 ${icons[buttonIcon].width} ${icons[buttonIcon].height}" fill="${iconcolor}">
                    ${icons[buttonIcon].svg}
                </svg>`;
        };

        this.handleFullscreen = () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
                this.setFullscreenData(false);

                mediaContainer.removeEventListener('mousemove', this.handleFullscreenControls);
                fullscreenVisible = true;
                clearTimeout(fullscreenTimeout);
                this.fullscreenVisible();
            } else {
                mediaContainer.requestFullscreen();
                this.setFullscreenData(true);

                fullscreenVisible = false;
                this.fullscreenHidden();
                mediaContainer.addEventListener('mousemove', this.handleFullscreenControls);
            }
        };

        this.handleFullscreenControls = () => {
            if (!fullscreenVisible) {
                fullscreenVisible = true
                this.fullscreenVisible();

                clearTimeout(fullscreenTimeout);

                fullscreenTimeout = setTimeout(() => {
                    fullscreenVisible = false;
                    this.fullscreenHidden();
                }, 2000);
            }
        };

        this.fullscreenHidden = () => {
            mediaContainer.style.cursor = "none";
            mediaControls.classList.add("fullscreen_hidden");
        };

        this.fullscreenVisible = () => {
            mediaContainer.style.cursor = "default";
            mediaControls.classList.remove("fullscreen_hidden");
        };

        this.mediaTimeToHMS = (time) => {
            let seconds = parseInt(time)
            const hours = parseInt(seconds / 3600);
            seconds = seconds % 3600;
            const minutes = parseInt(seconds / 60);
            seconds = seconds % 60;
            return (hours < 10 ? "0" : "") + hours + ":" +
                (minutes < 10 ? "0" : "") + minutes + ":" +
                (seconds < 10 ? "0" : "") + seconds;
        };

        this.updateVolume = (x) => {
            let vol = (x - (volumeBar.offsetLeft + volumeBar.offsetParent.offsetLeft)) / volumeBar.clientWidth;
            if (vol > 1) {
                vol = 1;
            }
            if (vol < 0) {
                vol = 0;
            }
            volumeBar.style.clip = "rect(0px, " + ((vol * 100) / 20) + "vw,2vh,0px)";
            media.volume = vol;
            this.updateVolumeIcon(vol);
        };

        this.updateVolumeIcon = (vol) => {
            let icon = (vol > 0) ? "volume" : "mute";
            volumeIcon.innerHTML = `<svg viewBox="0 0 ${icons[icon].width} ${icons[icon].height}" fill="${iconcolor}">
                                        ${icons[icon].svg}
                                    </svg>`;
        };

        media.addEventListener("loadedmetadata", () => {
            mediaTime.textContent = "00:00:00";
        });
        media.addEventListener("play", () => { this.changeButtonState("playpause") }, false);
        media.addEventListener("pause", () => { this.changeButtonState("playpause") }, false);
        media.addEventListener("timeupdate", () => {
            progressBar.style.width = Math.floor((media.currentTime / media.duration) * 100) + "%";
            mediaTime.textContent = this.mediaTimeToHMS(media.currentTime);
        });

        volume.addEventListener("mousedown", (e) => {
            volumeDrag = true;
            media.muted = false;
            this.updateVolume(e.pageX);
        });

        volumeIcon.addEventListener("click", () => {
            media.muted = !media.muted;
            if (media.muted) {
                let icon = "mute";
                volumeIcon.innerHTML = `<svg viewBox="0 0 ${icons[icon].width} ${icons[icon].height}" fill="${iconcolor}">
                                        ${icons[icon].svg}
                                    </svg>`;
            } else {
                this.updateVolumeIcon(media.volume);
            }
        });

        progress.addEventListener("click", function(e) {
            const pos = (e.pageX - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
            media.currentTime = pos * media.duration;
        });
        playpause.addEventListener("click", () => {
            (media.paused || media.ended) ? media.play(): media.pause();
        });
        if (fullscreen) fullscreen.addEventListener("click", () => { this.handleFullscreen() });

        document.addEventListener("fullscreenchange", () => {
            this.setFullscreenData(!!(document.fullscreenElement));
        });
        document.addEventListener("mouseup", (e) => {
            if (volumeDrag) {
                volumeDrag = false;
                this.updateVolume(e.pageX);
            }
        });
        document.addEventListener("mousemove", (e) => {
            if (volumeDrag) {
                this.updateVolume(e.pageX);
            }
        });
    }
}

module.exports = {
    MediaPlayer
};
