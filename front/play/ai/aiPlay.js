"use strict";

import {Position} from "../../GameLogic/Position.js";
import Grid from "../../GameLogic/Grid.js";
import {PARAMETER_NAME_IA_PLAYS} from "./constant.js";

const gameSocket = io("/api/game", {auth: {token: localStorage.getItem("token")}});
let grid = new Grid(7, 6);

let toPlay;
let colorPlayer;
let colorOtherPlayer;


function WebPageInteraction() {

    this.updateWebPageGrid = function (column, row, color) {
        let cell = document.getElementById(column + "-" + row);

        cell.classList.add("fall");
        if (color === Grid.redCellValue) {
            cell.classList.add("red-piece");
        } else {
            cell.classList.add("yellow-piece");
        }
    }

    this.webPagePlayTurn = function (event) {
        let clickCoords = event.target.id.split("-");
        let column = clickCoords[1];
        let row = clickCoords[0];
        play(column, row);
    }
    // Constructor -----------------------------------------------------------------------------------------------------
    this.addListeners = function(){
        for (let column = 0; column < grid.width; column++) {
            for (let line = 0; line < grid.height; line++) {
                let cell = document.getElementById(column + "-" + line);
                cell.setAttribute("value", Grid.defaultCellValue);
                cell.style.cursor = "pointer";
                cell.addEventListener("click", this.webPagePlayTurn);
            }
        }
    }

    let giveUpButton = document.getElementById("button-abandon");
    giveUpButton.addEventListener("click", function () {
        gameSocket.emit("giveUp");
        console.log("giveUp");
    });

    this.addListeners();


}

function removeListeners (){
    document.querySelectorAll(".grid-item").forEach(c => {
        c.removeEventListener("click", wpi.webPagePlayTurn);
        c.style.cursor = "not-allowed";
    });
}
let wpi = new WebPageInteraction()

let setupAI = function (AIplayTurn) {
    if (AIplayTurn !== 1 && AIplayTurn !== 2) {
        throw new Error("the value " + AIplayTurn + " of AIplay for the setup is invalid")
    }

    if (AIplayTurn === 1) {
        toPlay = false;
        colorPlayer = Grid.redCellValue
        colorOtherPlayer = Grid.yellowCellValue
        document.getElementById("page-title").innerText = "Au tour de l'adversaire";
    } else {
        toPlay = true;
        colorPlayer = Grid.yellowCellValue
        colorOtherPlayer = Grid.redCellValue
        document.getElementById("page-title").innerText = "A ton tour";
    }

    gameSocket.emit("setup", {AIplays: AIplayTurn})
    console.log("setup", {AIplays: AIplayTurn})
}

let play = function (clickRow, clickColumn) {
    let column = clickColumn;
    let row = grid.getRowOfLastDisk(column);

    // emit the event of the play not working yet
    gameSocket.emit("newMove", [+column, +row]);
    console.log("newMove", [column, row]);
    return new Position(column, row)
}

const url = new URL(window.location.href);
let AITurn = url.searchParams.get(PARAMETER_NAME_IA_PLAYS);

if (AITurn === null) {
    AITurn = 2;
}
gameSocket.on("connect", () => {
    console.log("Connected as human for a game vs AI with socket.id: " + gameSocket.id);
    console.log("token: " + localStorage.getItem("token"));

    setupAI(+AITurn);

    gameSocket.on("updatedBoard", globalCoordsGrid => {
        let move = grid.findMove(globalCoordsGrid.board)
        grid.cells = globalCoordsGrid.board

        // the client has to play
        if (toPlay) {
            // premier updateGrid, le joueur doit don jouer
            // deuxième updateGrid reçu après l'exécution de l'évènement newMove, il faut update lka grille
            wpi.updateWebPageGrid(move.column, move.row, colorPlayer)
            removeListeners();
            document.getElementById("page-title").innerText = "Au tour de l'adversaire";
        } else {
            // the client just receive the confirmation of its move
            wpi.updateWebPageGrid(move.column, move.row, colorOtherPlayer)
            wpi.addListeners();
            document.getElementById("page-title").innerText = "A ton tour";
        }
        toPlay = !toPlay
    })

    gameSocket.on("gameIsOver", (winner) => {
        console.log("gameIsOver received:", winner)
        let divWinner = document.getElementById("show-winner");
        let close = document.getElementById("cross");
        let winnerText = document.getElementById("winner-text");
        close.addEventListener("click", function () {
            divWinner.style.display = "none";
        });
        if (winner === "draw") {
            winnerText.innerText = "Egalité !!";
        } else {
            if (winner !== "AI"){
                winnerText.innerText = "Tu as gagné !!";
                let image = document.getElementById("pic");
                image.src = "../../images/smile.png";
            }
            else {
                winnerText.innerText = "Tu as perdu !!";
            }
        }
        divWinner.style.display = "block";
        removeListeners();
    });

    gameSocket.on("playError", (Error) => {
        console.log("playError received:", Error)
    });
});

export {PARAMETER_NAME_IA_PLAYS}




