"use strict";

import {ACHIEVEMENTS_API, API_URL} from "../util/path.js";
import {BASE_URL_API} from "../util/frontPath.js";
import {informativePopUp} from "../templates/popUp/informativePopUp/informativePopUp.js";

class KonamiCode {
    constructor(showHints = false) {
        this.debug = showHints;
        this.code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a", "Enter"];
        this.positionInKonamiCode = 0;
    }

    checkKey(e) {
        if (e.key === this.code[this.positionInKonamiCode]) {
            this.positionInKonamiCode++;

            if (this.debug) console.log(this.positionInKonamiCode, this.code[this.positionInKonamiCode]);

            if (this.positionInKonamiCode === this.code.length) {
                this.positionInKonamiCode = 0;
                informativePopUp("Bravo tu as fait le Konami Code !")

                fetch(BASE_URL_API + API_URL + ACHIEVEMENTS_API + "add/", {
                    method: "post", headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify({token: localStorage.getItem("token"), achievement: "konami"})
                }).then((response) => {
                    console.log("konami success unlocked");
                });
            }
        } else {
            this.positionInKonamiCode = 0;
        }
    }
}

export {KonamiCode};
