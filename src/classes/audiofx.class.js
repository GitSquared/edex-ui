class AudioManager {
    constructor() {
        const path = require("path");
        const {Howl, Howler} = require("howler");

        if (window.settings.audio === true) {
            this.beep1 = new Howl({
                src: [path.join(__dirname, "assets", "audio", "beep1.wav")]
            });
            this.beep2 = new Howl({
                src: [path.join(__dirname, "assets", "audio", "beep2.wav")]
            });
            this.beep3 = new Howl({
                src: [path.join(__dirname, "assets", "audio", "beep3.wav")],
                volume: 0.6
            });
            this.beep4 = new Howl({
                src: [path.join(__dirname, "assets", "audio", "beep4.wav")]
            });
            this.dismiss = new Howl({
                src: [path.join(__dirname, "assets", "audio", "dismiss.wav")]
            });
            this.alarm = new Howl({
                src: [path.join(__dirname, "assets", "audio", "alarm.wav")]
            });
            this.info = new Howl({
                src: [path.join(__dirname, "assets", "audio", "info.wav")]
            });
        } else {
            Howler.volume(0.0);
        }

        if (window.settings.extraAudio === true) {
            this.beep5 = new Howl({
                src: [path.join(__dirname, "assets", "audio", "beep5.wav")]
            });
            this.intro = new Howl({
                src: [path.join(__dirname, "assets", "audio", "intro.wav")]
            });
            this.scan = new Howl({
                src: [path.join(__dirname, "assets", "audio", "scan.wav")]
            });
            this.ping = new Howl({
                src: [path.join(__dirname, "assets", "audio", "ping.wav")],
                volume: 0.02
            });
            this.pingFailed = new Howl({
                src: [path.join(__dirname, "assets", "audio", "pingFailed.wav")],
                volume: 0.02
            });
        }

        // Return a proxy to avoid errors if sounds aren't loaded
        return new Proxy(this, {
            get: (target, sound) => {
                if (sound in target) {
                    return target[sound];
                } else {
                    return {
                        play: () => {return true;}
                    }
                }
            }
        });
    }
}

module.exports = {
    AudioManager
};
