class AudioManager {
    constructor() {
        const path = require("path");
        const {Howl, Howler} = require("howler");

        // Load sounds
        this.beep1 = new Howl({
            src: [path.join(__dirname, "assets", "audio", "beep1.wav")]
        });
        this.beep2 = new Howl({
            src: [path.join(__dirname, "assets", "audio", "beep2.wav")]
        });
        this.beep3 = new Howl({
            src: [path.join(__dirname, "assets", "audio", "beep3.wav")]
        });
        this.beep4 = new Howl({
            src: [path.join(__dirname, "assets", "audio", "beep4.wav")]
        });
        this.intro = new Howl({
            src: [path.join(__dirname, "assets", "audio", "intro.wav")]
        });
        this.dismiss = new Howl({
            src: [path.join(__dirname, "assets", "audio", "dismiss.wav")]
        });
        this.alarm = new Howl({
            src: [path.join(__dirname, "assets", "audio", "alarm.wav")]
        });

        if (window.settings.audio !== true) {
            Howler.volume(0.0);
        }
    }
}

module.exports = {
    AudioManager
};
