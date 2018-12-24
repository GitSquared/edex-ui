class Keyboard {
    constructor(opts) {
        if (!opts.layout || !opts.container) throw "Missing options";

        const ctrlseq = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        const layout = JSON.parse(require("fs").readFileSync(opts.layout, {encoding: "utf-8"}));
        const container = document.getElementById(opts.container);

        // Set default keyboard properties
        container.dataset.isShiftOn = false;
        container.dataset.isCapsLckOn = false;
        container.dataset.isAltOn = false;
        container.dataset.isCtrlOn = false;
        container.dataset.isFnOn = false;

        // Parse keymap and create DOM
        Object.keys(layout).forEach((row) => {
            container.innerHTML += `<div class="keyboard_row" id="`+row+`"></div>`;
            layout[row].forEach((keyObj) => {
                let key = document.createElement("div");
                key.setAttribute("class", "keyboard_key");

                if (keyObj.cmd === " ") {
                    key.setAttribute("id", "keyboard_spacebar");
                } else if (keyObj.cmd === "\r") {
                    key.setAttribute("class", "keyboard_key keyboard_enter");
                    key.innerHTML = `<h1>${keyObj.name}</h1>`;
                } else {
                    key.innerHTML = `
                        <h5>${keyObj.altshift_name || ""}</h5>
                        <h4>${keyObj.fn_name || ""}</h4>
                        <h3>${keyObj.alt_name || ""}</h3>
                        <h2>${keyObj.shift_name || ""}</h2>
                        <h1>${keyObj.name || ""}</h1>`;
                }

                Object.keys(keyObj).forEach((property) => {
                    for (let i = 1; i < ctrlseq.length; i++) {
                        keyObj[property] = keyObj[property].replace("~~~CTRLSEQ"+i+"~~~", ctrlseq[i]);
                    }
                    if (property.endsWith("cmd")) {
                        key.dataset[property] = keyObj[property];
                    }
                });

                document.getElementById(row).appendChild(key);
            });
        });

        // Helper functions for latin diacritics
        let addCircum = (char) => {
            switch(char) {
                case "a":
                    return "â";
                case "A":
                    return "Â";
                case "z":
                    return "ẑ";
                case "Z":
                    return "Ẑ";
                case "e":
                    return "ê";
                case "E":
                    return "Ê";
                case "y":
                    return "ŷ";
                case "Y":
                    return "Ŷ";
                case "u":
                    return "û";
                case "U":
                    return "Û";
                case "i":
                    return "î";
                case "I":
                    return "Î";
                case "o":
                    return "ô";
                case "O":
                    return "Ô";
                case "s":
                    return "ŝ";
                case "S":
                    return "Ŝ";
                case "g":
                    return "ĝ";
                case "G":
                    return "Ĝ";
                case "h":
                    return "ĥ";
                case "H":
                    return "Ĥ";
                case "j":
                    return "ĵ";
                case "J":
                    return "Ĵ";
                case "w":
                    return "ŵ";
                case "W":
                    return "Ŵ";
                case "c":
                    return "ĉ";
                case "C":
                    return "Ĉ";
                // the circumflex can also be used for superscript numbers
                case "1":
                    return "¹";
                case "2":
                    return "²";
                case "3":
                    return "³";
                case "4":
                    return "⁴";
                case "5":
                    return "⁵";
                case "6":
                    return "⁶";
                case "7":
                    return "⁷";
                case "8":
                    return "⁸";
                case "9":
                    return "⁹";
                case "0":
                    return "⁰";
                default:
                    return char;
            }
        };
        let addTrema = (char) => {
            switch(char) {
                case "a":
                    return "ä";
                case "A":
                    return "Ä";
                case "e":
                    return "ë";
                case "E":
                    return "Ë";
                case "t":
                    return "ẗ";
                // My keyboard says no uppercase ẗ
                case "y":
                    return "ÿ";
                case "Y":
                    return "Ÿ";
                case "u":
                    return "ü";
                case "U":
                    return "Ü";
                case "i":
                    return "ï";
                case "I":
                    return "Ï";
                case "o":
                    return "ö";
                case "O":
                    return "Ö";
                case "h":
                    return "ḧ";
                case "H":
                    return "Ḧ";
                case "w":
                    return "ẅ";
                case "W":
                    return "Ẅ";
                case "x":
                    return "ẍ";
                case "X":
                    return "Ẍ";
                default:
                    return char;
            }
        };
        let addAcute = (char) => {
            switch(char) {
            case "a":
                return "á";
            case "A":
                return "Á";
            case "c":
                return "ć";
            case "C":
                return "Ć";
            case "e":
                return "é";
            case "E":
                return "E";
            case "g":
                return "ǵ";
            case "G":
                return "Ǵ";
            case "i":
                return "í";
            case "I":
                return "Í";
            case "j":
                return "ȷ́";
            case "J":
                return "J́";
            case "k":
                return "ḱ";
            case "K":
                return "Ḱ";
            case "l":
                return "ĺ";
            case "L":
                return "Ĺ";
            case "m":
                return "ḿ";
            case "M":
                return "Ḿ";
            case "n":
                return "ń";
            case "N":
                return "Ń";
            case "o":
                return "ó";
            case "O":
                return "Ó";
            case "p":
                return "ṕ";
            case "P":
                return "Ṕ";
            case "r":
                return "ŕ";
            case "R":
                return "Ŕ";
            case "s":
                return "ś";
            case "S":
                return "Ś";
            case "u":
                return "ú";
            case "U":
                return "Ú";
            case "v":
                return "v́";
            case "V":
                return "V́";
            case "w":
                return "ẃ";
            case "W":
                return "Ẃ";
            case "y":
                return "ý";
            case "Y":
                return "Ý";
            case "z":
                return "ź";
            case "Z":
                return "Ź";
            case "ê":
                return "ế";
            case "Ê":
                return "Ế";
            case "ç":
                return "ḉ";
            case "Ç":
                return "Ḉ";
            default:
                return char;
            }
        };
        let addGrave = (char) => {
            switch (char) {
            case "a":
                return "à";
            case "A":
                return "À";
            case "e":
                return "è";
            case "E":
                return "È";
            case "i":
                return "ì";
            case "I":
                return "Ì";
            case "m":
                return "m̀";
            case "M":
                return "M̀";
            case "n":
                return "ǹ";
            case "N":
                return "Ǹ";
            case "o":
                return "ò";
            case "O":
                return "Ò";
            case "u":
                return "ù";
            case "U":
                return "Ù";
            case "v":
                return "v̀";
            case "V":
                return "V̀";
            case "w":
                return "ẁ";
            case "W":
                return "Ẁ";
            case "y":
                return "ỳ";
            case "Y":
                return "Ỳ";
            case "ê":
                return "ề";
            case "Ê":
                return "Ề";
            default:
                return char;
            }
        };
        let addCaron = (char) => {
            switch (char) {
            case "a":
                return "ǎ";
            case "A":
                return "Ǎ";
            case "c":
                return "č";
            case "C":
                return "Č";
            case "d":
                return "ď";
            case "D":
                return "Ď";
            case "e":
                return "ě";
            case "E":
                return "Ě";
            case "g":
                return "ǧ";
            case "G":
                return "Ǧ";
            case "h":
                return "ȟ";
            case "H":
                return "Ȟ";
            case "i":
                return "ǐ";
            case "I":
                return "Ǐ";
            case "j":
                return "ǰ";
            case "k":
                return "ǩ";
            case "K":
                return "Ǩ";
            case "l":
                return "ľ";
            case "L":
                return "Ľ";
            case "n":
                return "ň";
            case "N":
                return "Ň";
            case "o":
                return "ǒ";
            case "O":
                return "Ǒ";
            case "r":
                return "ř";
            case "R":
                return "Ř";
            case "s":
                return "š";
            case "S":
                return "Š";
            case "t":
                return "ť";
            case "T":
                return "Ť";
            case "u":
                return "ǔ";
            case "U":
                return "Ǔ";
            case "z":
                return "ž";
            case "Z":
                return "Ž";
                // caron can also be used for subscript numbers
            case "1":
                return "₁";
            case "2":
                return "₂";
            case "3":
                return "₃";
            case "4":
                return "₄";
            case "5":
                return "₅";
            case "6":
                return "₆";
            case "7":
                return "₇";
            case "8":
                return "₈";
            case "9":
                return "₉";
            case "0":
                return "₀";
            default:
                return char;
            }
        };
        let addBar = (char) => {
            switch (char) {
            case "a":
                return "ⱥ";
            case "A":
                return "Ⱥ";
            case "b":
                return "ƀ";
            case "B":
                return "Ƀ";
            case "c":
                return "ȼ";
            case "C":
                return "Ȼ";
            case "d":
                return "đ";
            case "D":
                return "Đ";
            case "e":
                return "ɇ";
            case "E":
                return "Ɇ";
            case "g":
                return "ǥ";
            case "G":
                return "Ǥ";
            case "h":
                return "ħ";
            case "H":
                return "Ħ";
            case "i":
                return "ɨ";
            case "I":
                return "Ɨ";
            case "j":
                return "ɉ";
            case "J":
                return "Ɉ";
            case "l":
                return "ł";
            case "L":
                return "Ł";
            case "o":
                return "ø";
            case "O":
                return "Ø";
            case "p":
                return "ᵽ";
            case "P":
                return "Ᵽ";
            case "r":
                return "ɍ";
            case "R":
                return "Ɍ";
            case "t":
                return "ŧ";
            case "T":
                return "Ŧ";
            case "u":
                return "ʉ";
            case "U":
                return "Ʉ";
            case "y":
                return "ɏ";
            case "Y":
                return "Ɏ";
            case "z":
                return "ƶ";
            case "Z":
                return "Ƶ";
            default:
                return char;
            }
        };
        let addBreve = (char) => {
            switch (char) {
            case "a":
                return "ă";
            case "A":
                return "Ă";
            case "e":
                return "ĕ";
            case "E":
                return "Ĕ";
            case "g":
                return "ğ";
            case "G":
                return "Ğ";
            case "i":
                return "ĭ";
            case "I":
                return "Ĭ";
            case "o":
                return "ŏ";
            case "O":
                return "Ŏ";
            case "u":
                return "ŭ";
            case "U":
                return "Ŭ";
            case "à":
                return "ằ";
            case "À":
                return "Ằ";
            default:
                return char;
            }
        };
        let addTilde = (char) => {
            switch (char) {
            case "a":
                return "ã";
            case "A":
                return "Ã";
            case "e":
                return "ẽ";
            case "E":
                return "Ẽ";
            case "i":
                return "ĩ";
            case "I":
                return "Ĩ";
            case "n":
                return "ñ";
            case "N":
                return "Ñ";
            case "o":
                return "õ";
            case "O":
                return "Õ";
            case "u":
                return "ũ";
            case "U":
                return "Ũ";
            case "v":
                return "ṽ";
            case "V":
                return "Ṽ";
            case "y":
                return "ỹ";
            case "Y":
                return "Ỹ";
            case "ê":
                return "ễ";
            case "Ê":
                return "Ễ";
            default:
                return char;
            }
        };
        let addMacron = (char) => {
            switch (char) {
            case "a":
                return "ā";
            case "A":
                return "Ā";
            case "e":
                return "ē";
            case "E":
                return "Ē";
            case "g":
                return "ḡ";
            case "G":
                return "Ḡ";
            case "i":
                return "ī";
            case "I":
                return "Ī";
            case "o":
                return "ō";
            case "O":
                return "Ō";
            case "u":
                return "ū";
            case "U":
                return "Ū";
            case "y":
                return "ȳ";
            case "Y":
                return "Ȳ";
            case "é":
                return "ḗ";
            case "É":
                return "Ḗ";
            case "è":
                return "ḕ";
            case "È":
                return "Ḕ";
            default:
                return char;
            }
        };
        let addCedilla = (char) => {
            switch (char) {
            case "c":
                return "ç";
            case "C":
                return "Ç";
            case "d":
                return "ḑ";
            case "D":
                return "Ḑ";
            case "e":
                return "ȩ";
            case "E":
                return "Ȩ";
            case "g":
                return "ģ";
            case "G":
                return "Ģ";
            case "h":
                return "ḩ";
            case "H":
                return "Ḩ";
            case "k":
                return "ķ";
            case "K":
                return "Ķ";
            case "l":
                return "ļ";
            case "L":
                return "Ļ";
            case "n":
                return "ņ";
            case "N":
                return "Ņ";
            case "r":
                return "ŗ";
            case "R":
                return "Ŗ";
            case "s":
                return "ş";
            case "S":
                return "Ş";
            case "t":
                return "ţ";
            case "T":
                return "Ţ";
            default:
                return char;
            }
        };
        let addOverring = (char) => {
            switch (char) {
            case "a":
                return "å";
            case "A":
                return "Å";
            case "u":
                return "ů";
            case "U":
                return "Ů";
            case "w":
                return "ẘ"; // capital w with overring not supported on bépo layout apparently
            case "y":
                return "ẙ"; // same for capital y with overring
            default:
                return char;
            }
        };
        let toGreek = (char) => {
            switch (char) {
            case "b":
                return "β";
            case "p":
                return "π";
            case "P":
                return "Π";
            case "d":
                return "δ";
            case "D":
                return "Δ";
            case "l":
                return "λ";
            case "L":
                return "Λ";
            case "j":
                return "θ";
            case "J":
                return "Θ";
            case "z":
                return "ζ";
            case "w":
                return "ω";
            case "W":
                return "Ω";
            case "A":
                return "α";
            case "u":
                return "υ";
            case "U":
                return "Υ";
            case "i":
                return "ι";
            case "e":
                return "ε";
            case "t":
                return "τ";
            case "s":
                return "σ";
            case "S":
                return "Σ";
            case "r":
                return "ρ";
            case "R":
                return "Ρ";
            case "n":
                return "ν";
            case "m":
                return "μ";
            case "y":
                return "ψ";
            case "Y":
                return "Ψ";
            case "x":
                return "ξ";
            case "X":
                return "Ξ";
            case "k":
                return "κ";
            case "q":
                return "χ";
            case "Q":
                return "Χ";
            case "g":
                return "γ";
            case "G":
                return "Γ";
            case "h":
                return "η";
            case "f":
                return "φ";
            case "F":
                return "Φ";
            default:
                return char;
            }
        };
        let addIotasub = (char) => {
            switch (char) {
            case "o":
                return "ǫ";
            case "O":
                return "Ǫ";
            case "a":
                return "ą";
            case "A":
                return "Ą";
            case "u":
                return "ų";
            case "U":
                return "Ų";
            case "i":
                return "į";
            case "I":
                return "Į";
            case "e":
                return "ę";
            case "E":
                return "Ę";
            default:
                return char;
            }
        };

        // Apply click (and/or touch) handler functions (write to socket and animations)
        let pressKey = (key) => {
            let cmd = key.dataset.cmd || "";
            if (container.dataset.isShiftOn === "true" && key.dataset.shift_cmd || container.dataset.isCapsLckOn === "true" && key.dataset.shift_cmd) cmd = key.dataset.capslck_cmd || key.dataset.shift_cmd;
            if (container.dataset.isCtrlOn === "true" && key.dataset.ctrl_cmd) cmd = key.dataset.ctrl_cmd;
            if (container.dataset.isAltOn === "true" && key.dataset.alt_cmd) cmd = key.dataset.alt_cmd;
            if (container.dataset.isAltOn === "true" && container.dataset.isShiftOn === "true" && key.dataset.altshift_cmd) cmd = key.dataset.altshift_cmd;
            if (container.dataset.isFnOn === "true" && key.dataset.fn_cmd) cmd = key.dataset.fn_cmd;

            if (container.dataset.isNextCircum === "true") {
                cmd = addCircum(cmd);
                container.dataset.isNextCircum = "false";
            }
            if (container.dataset.isNextTrema === "true") {
                cmd = addTrema(cmd);
                container.dataset.isNextTrema = "false";
            }
            if (container.dataset.isNextAcute === "true") {
                cmd = addAcute(cmd);
                container.dataset.isNextAcute = "false";
            }
            if (container.dataset.isNextGrave === "true") {
                cmd = addGrave(cmd);
                container.dataset.isNextGrave = "false";
            }
            if (container.dataset.isNextCaron === "true") {
                cmd = addCaron(cmd);
                container.dataset.isNextCaron = "false";
            }
            if (container.dataset.isNextBar === "true") {
                cmd = addBar(cmd);
                container.dataset.isNextBar = "false";
            }
            if (container.dataset.isNextBreve === "true") {
                cmd = addBreve(cmd);
                container.dataset.isNextBreve = "false";
            }
            if (container.dataset.isNextTilde === "true") {
                cmd = addTilde(cmd);
                container.dataset.isNextTilde = "false";
            }
            if (container.dataset.isNextMacron === "true") {
                cmd = addMacron(cmd);
                container.dataset.isNextMacron = "false";
            }
            if (container.dataset.isNextCedilla === "true") {
                cmd = addCedilla(cmd);
                container.dataset.isNextCedilla = "true";
            }
            if (container.dataset.isNextOverring === "true") {
                cmd = addOverring(cmd);
                container.dataset.isNextOverring = "false";
            }
            if (container.dataset.isNextGreek === "true") {
                cmd = toGreek(cmd);
                container.dataset.isNextGreek = "false";
            }
            if (container.dataset.isNextIotasub === "true") {
                cmd = addIotasub(cmd);
                container.dataset.isNextIotasub = "false";
            }


            if (cmd.startsWith("ESCAPED|-- ")) {
                cmd = cmd.substr(11);
                switch(cmd) {
                    case "CAPSLCK: ON":
                        container.dataset.isCapsLckOn = "true";
                        break;
                    case "CAPSLCK: OFF":
                        container.dataset.isCapsLckOn = "false";
                        break;
                    case "FN: ON":
                        container.dataset.isFnOn = "true";
                        break;
                    case "FN: OFF":
                        container.dataset.isFnOn = "false";
                        break;
                    case "CIRCUM":
                        container.dataset.isNextCircum = "true";
                        break;
                    case "TREMA":
                        container.dataset.isNextTrema = "true";
                        break;
                    case "ACUTE":
                        container.dataset.isNextAcute = "true";
                        break;
                    case "GRAVE":
                        container.dataset.isNextGrave = "true";
                        break;
                    case "CARON":
                        container.dataset.isNextCaron = "true";
                        break;
                    case "BAR":
                        container.dataset.isNextBar = "true";
                        break;
                    case "BREVE":
                        container.dataset.isNextBreve = "true";
                        break;
                    case "MACRON":
                        container.dataset.isNextMacron = "true";
                        break;
                    case "CEDILLA":
                        container.dataset.isNextCedilla = "true";
                        break;
                    case "OVERRING":
                        container.dataset.isNextOverring = "true";
                        break;
                    case "GREEK":
                        container.dataset.isNextGreek = "true";
                        break;
                    case "IOTASUB":
                        container.dataset.isNextIotasub = "true";
                        break;
                }
            } else if (cmd === "\n") {
                window.term[window.currentTerm].writelr("");
            } else if (cmd === ctrlseq[19] && window.term[window.currentTerm].term.hasSelection()) {
                window.term[window.currentTerm].clipboard.copy();
            } else if (cmd === ctrlseq[20] && window.term[window.currentTerm].clipboard.didCopy) {
                window.term[window.currentTerm].clipboard.paste();
            } else {
                window.term[window.currentTerm].write(cmd);
            }
        };

        container.childNodes.forEach((row) => {
            row.childNodes.forEach((key) => {

                let enterElements = document.querySelectorAll(".keyboard_enter");

                if (key.attributes["class"].value.endsWith("keyboard_enter")) {
                    // The enter key is divided in two dom elements, so we bind their animations here

                    key.onmousedown = (e) => {
                        pressKey(key);
                        key.holdTimeout = setTimeout(() => {
                            key.holdInterval = setInterval(() => {
                                pressKey(key);
                            }, 70);
                        }, 400);

                        enterElements.forEach((key) => {
                            key.setAttribute("class", "keyboard_key active keyboard_enter");
                        });

                        // Keep focus on the terminal
                        window.term[window.currentTerm].term.focus();

                        window.audioManager.beep2.play();
                        e.preventDefault();
                    };
                    key.onmouseup = () => {
                        clearTimeout(key.holdTimeout);
                        clearInterval(key.holdInterval);

                        enterElements.forEach((key) => {
                            key.setAttribute("class", "keyboard_key blink keyboard_enter");
                        });
                        setTimeout(() => {
                            enterElements.forEach((key) => {
                                key.setAttribute("class", "keyboard_key keyboard_enter");
                            });
                        }, 100);
                    };
                } else {
                    key.onmousedown = (e) => {
                        if (key.dataset.cmd.startsWith("ESCAPED|-- ")) {
                            let cmd = key.dataset.cmd.substr(11);
                            if (cmd.startsWith("CTRL")) {
                                container.dataset.isCtrlOn = "true";
                            }
                            if (cmd.startsWith("SHIFT")) {
                                container.dataset.isShiftOn = "true";
                            }
                            if (cmd.startsWith("ALT")) {
                                container.dataset.isAltOn = "true";
                            }
                        } else {
                            key.holdTimeout = setTimeout(() => {
                                key.holdInterval = setInterval(() => {
                                    pressKey(key);
                                }, 70);
                            }, 400);
                        }
                        pressKey(key);

                        // Keep focus on the terminal
                        window.term[window.currentTerm].term.focus();

                        window.audioManager.beep3.play();
                        e.preventDefault();
                    };
                    key.onmouseup = (e) => {
                        if (key.dataset.cmd.startsWith("ESCAPED|-- ")) {
                            let cmd = key.dataset.cmd.substr(11);
                            if (cmd.startsWith("CTRL")) {
                                container.dataset.isCtrlOn = "false";
                            }
                            if (cmd.startsWith("SHIFT")) {
                                container.dataset.isShiftOn = "false";
                            }
                            if (cmd.startsWith("ALT")) {
                                container.dataset.isAltOn = "false";
                            }
                        } else {
                            clearTimeout(key.holdTimeout);
                            clearInterval(key.holdInterval);
                        }

                        key.setAttribute("class", "keyboard_key blink");
                        setTimeout(() => {
                            key.setAttribute("class", "keyboard_key");
                        }, 100);
                    };
                }

                // See #229
                key.onmouseleave = () => {
                    clearTimeout(key.holdTimeout);
                    clearInterval(key.holdInterval);
                };
            });
        });

        // Tactile multi-touch support (#100)
        container.addEventListener("touchstart", e => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                let key = e.changedTouches[i].target.offsetParent;
                if (key.getAttribute("class").startsWith("keyboard_key")) {
                    key.setAttribute("class", key.getAttribute("class")+" active");
                    key.onmousedown({preventDefault: () => {return true}});
                } else {
                    key = e.changedTouches[i].target;
                    if (key.getAttribute("class").startsWith("keyboard_key")) {
                        key.setAttribute("class", key.getAttribute("class")+" active");
                        key.onmousedown({preventDefault: () => {return true}});
                    }
                }
            }
        });
        container.addEventListener("touchend", e => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                let key = e.changedTouches[i].target.offsetParent;
                if (key.getAttribute("class").startsWith("keyboard_key")) {
                    key.setAttribute("class", key.getAttribute("class").replace("active", ""));
                    key.onmouseup({preventDefault: () => {return true}});
                } else {
                    key = e.changedTouches[i].target;
                    if (key.getAttribute("class").startsWith("keyboard_key")) {
                        key.setAttribute("class", key.getAttribute("class").replace("active", ""));
                        key.onmouseup({preventDefault: () => {return true}});
                    }
                }
            }
        });

        // Bind actual keyboard actions to on-screen animations (for use without a touchscreen)
        let findKey = (e) => {
            // Fix incorrect querySelector error
            let physkey;
            (e.key === "\"") ? physkey = `\\"` : physkey = e.key;

            // Find basic keys (typically letters, upper and lower-case)
            let key = document.querySelector('div.keyboard_key[data-cmd="'+physkey+'"]');
            if (key === null) key = document.querySelector('div.keyboard_key[data-shift_cmd="'+physkey+'"]');

            // Find special keys (shift, control, arrows, etc.)
            if (key === null && e.code === "ShiftLeft") key = document.querySelector('div.keyboard_key[data-cmd="ESCAPED|-- SHIFT: LEFT"]');
            if (key === null && e.code === "ShiftRight") key = document.querySelector('div.keyboard_key[data-cmd="ESCAPED|-- SHIFT: RIGHT"]');
            if (key === null && e.code === "ControlLeft") key = document.querySelector('div.keyboard_key[data-cmd="ESCAPED|-- CTRL: LEFT"]');
            if (key === null && e.code === "ControlRight") key = document.querySelector('div.keyboard_key[data-cmd="ESCAPED|-- CTRL: RIGHT"]');
            if (key === null && e.code === "AltLeft") key = document.querySelector('div.keyboard_key[data-cmd="ESCAPED|-- FN: ON"]');
            if (key === null && e.code === "AltRight") key = document.querySelector('div.keyboard_key[data-cmd="ESCAPED|-- ALT: RIGHT"]');
            if (key === null && e.code === "CapsLock") key = document.querySelector('div.keyboard_key[data-cmd="ESCAPED|-- CAPSLCK: ON"]');
            if (key === null && e.code === "Escape") key = document.querySelector('div.keyboard_key[data-cmd=""]');
            if (key === null && e.code === "Backspace") key = document.querySelector('div.keyboard_key[data-cmd=""]');
            if (key === null && e.code === "ArrowUp") key = document.querySelector('div.keyboard_key[data-cmd="OA"]');
            if (key === null && e.code === "ArrowLeft") key = document.querySelector('div.keyboard_key[data-cmd="OD"]');
            if (key === null && e.code === "ArrowDown") key = document.querySelector('div.keyboard_key[data-cmd="OB"]');
            if (key === null && e.code === "ArrowRight") key = document.querySelector('div.keyboard_key[data-cmd="OC"]');
            if (key === null && e.code === "Enter") key = document.querySelectorAll('div.keyboard_key.keyboard_enter');

            // Find "rare" keys (ctrl and alt symbols)
            if (key === null) key = document.querySelector('div.keyboard_key[data-ctrl_cmd="'+e.key+'"]');
            if (key === null) key = document.querySelector('div.keyboard_key[data-alt_cmd="'+e.key+'"]');

            return key;
        };

        document.onkeydown = (e) => {
            let key = findKey(e);
            if (key === null) return;
            if (key.length) {
                key.forEach((enterElement) => {
                    enterElement.setAttribute("class", "keyboard_key active keyboard_enter");
                });
            } else {
                key.setAttribute("class", "keyboard_key active");
            }
            window.audioManager.beep3.play();
        };

        document.onkeyup = (e) => {
            let key = findKey(e);
            if (key === null) return;
            if (key.length) {
                key.forEach((enterElement) => {
                    enterElement.setAttribute("class", "keyboard_key blink keyboard_enter");
                });
                setTimeout(() => {
                    key.forEach((enterElement) => {
                        enterElement.setAttribute("class", "keyboard_key keyboard_enter");
                    });
                }, 100);
            } else {
                key.setAttribute("class", "keyboard_key blink");
                setTimeout(() => {
                    key.setAttribute("class", "keyboard_key");
                }, 100);
            }

            if (e.key === "Enter") {
                window.audioManager.beep2.play();
            }
        };
    }
}

module.exports = {
    Keyboard
};
