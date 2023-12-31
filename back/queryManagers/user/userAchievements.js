"use strict";

import {BODY, checkAuthorization, sendResponse} from "../utilsApi.js";
import jwt from "jsonwebtoken";
import achievementdb from "../../database/achievementdb.js";

export function achievementsManager(request, response, urlPathArray) {
    if (!authorizeRequest(request, response)) {
        return;
    }

    switch (urlPathArray[0]) {
        case "add":
            addAchievements(request, response);
            break;
        case "getAll":
            getAllAchievements(request, response, urlPathArray[1]);
            break;
        case "getAllPossible":
            getAllPossibleAchievements(request, response);
            break;
        default:
            console.log("URL", request.url, "not supported");
            sendResponse(response, 404, "URL " + request.url + " not supported");
            break;
    }
}

function authorizeRequest(request, response) {
    if (!checkAuthorization(request)) {
        sendResponse(response, 401, "Unauthorized");
        return false;
    }
    return true;
}


function addAchievements(request, response) {
    let data = request[BODY];
    let token = data.token;

    let achievement = data.achievement;
    let userId = jwt.decode(token).userId;
    achievementdb.addAchievement(userId, achievement, 1, true).then((achievementAdded) => {
        sendResponse(response, 201, "OK");
    }).catch((err) => {
        sendResponse(response, 409, "Achievement not added: " + JSON.stringify(err));
    });
}

function getAllAchievements(request, response, userId) {
    achievementdb.getAchievementsForUser(userId).then((achievements) => {
        sendResponse(response, 200, JSON.stringify(achievements));
    }).catch((err) => {
        console.log("Error: ", err);
        sendResponse(response, 409, "Achievements not found: " + JSON.stringify(err));
    });
}

function getAllPossibleAchievements(request, response) {
    sendResponse(response, 200, JSON.stringify(achievementdb.getAllPossibleAchievements()));
}
