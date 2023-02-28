import {parseJwt} from "../util/jwtParser.js";
import {BASE_URL, HOME_URL, SIGNUP_URL} from "../path.js";

document.getElementById("signup")
    .setAttribute("href",
        BASE_URL + "/" + SIGNUP_URL);

document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const values = {
        username: document.getElementById("login-username").value,
        password: document.getElementById("login-password").value,
    }

    fetch(BASE_URL + "api/login", {
        method: "post", headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json'
        }, body: JSON.stringify(values)
    }).then(async (response) => {
        // if the login worked, we should save the token.
        let jwtToken = await response.text();
        localStorage.setItem("token", jwtToken);

        let parsedJwt = parseJwt(jwtToken);
        console.log(parsedJwt);

        let username = parsedJwt.username;
        localStorage.setItem("username", username);

        let userId = parsedJwt.userId;
        localStorage.setItem("userId", userId);
        console.log("userId: " + userId);
        window.location.replace(BASE_URL + HOME_URL);
    });
});
