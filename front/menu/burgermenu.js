"use strict";

import {LOGIN_URL, HOME_URL, BASE_URL, PROFILE_URL} from "../path.js";

const house = BASE_URL + "/menu/images/house-solid.svg";
const profile = BASE_URL + "/menu/images/user-solid.svg";
const notifications = BASE_URL + "/menu/images/bell-solid.svg";
const friends = BASE_URL + "/menu/images/user-group-solid.svg";
const backToCurrentGame = BASE_URL + "/menu/images/gamepad-solid.svg";
const logout = BASE_URL + "/menu/images/right-from-bracket-solid.svg";

const iconWidth = "36";

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="` + BASE_URL + `/menu/burgermenu.css">
        <nav class="nav-bar top-corner-content">
            <div class="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
            <div id="nav-background"></div>
            <ul class="nav-menu">
                <li><a class="nav-link" href=` + BASE_URL + HOME_URL + `><img alt="Accueil" src=` + house + ` width="` + iconWidth + `"></a></li>
                <li><a class="nav-link" href=` + BASE_URL + PROFILE_URL + `><img alt="Profil" src=` + profile + ` width="` + iconWidth + `"></a></li>
                <li><a class="nav-link" href=` + BASE_URL + HOME_URL + `><img alt="Notifications" src=` + notifications + ` width="` + iconWidth + `"></a></li>
                <li><a class="nav-link" href=` + BASE_URL + HOME_URL + `><img alt="Amis" src=` + friends + ` width="` + iconWidth + `"></a></li>
                <!--<li><a class="nav-link" href=` + BASE_URL + HOME_URL + `><img alt="Jouer" src=` + backToCurrentGame + ` width="` + iconWidth + `"></a></li>-->
                <li><a class="nav-link" id="logout" href="#"><img alt="Se déconnecter" src=` + logout + ` width="` + iconWidth + `"></a></li>
            </ul>
        </nav>
`;

class BurgerMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const hamburger = this.shadowRoot.querySelector(".hamburger");
        const navMenu = this.shadowRoot.querySelector(".nav-menu");
        const navBar = this.shadowRoot.querySelector(".nav-bar");
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            navBar.classList.toggle("active");
        });

        this.shadowRoot.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            navBar.classList.remove("active");
        }));

        this.shadowRoot.getElementById("logout").addEventListener("click", () => {
            localStorage.clear();
            window.location.replace(BASE_URL + LOGIN_URL);
        });
    }
}

window.customElements.define('burger-menu', BurgerMenu);
