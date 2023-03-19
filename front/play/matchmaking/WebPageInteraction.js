import Grid from "../../GameLogic/Grid.js";
import {parseJwt} from "../../util/jwtParser.js";

class WebPageInteraction {

    #grid
    #socketMatchmaking;

    constructor(grid) {
        this.#grid = grid;
        console.log("WebPageInteraction constructor grid ", grid)
        this.addAllListeners();
    }

    setSocketMatchmaking = (socketMatchmaking) => {
        this.#socketMatchmaking = socketMatchmaking;
    }

    updateWebPageGrid = (column, row, color) => {
        let cell = document.getElementById(column + "-" + row);

        cell.classList.add("fall");
        if (color === Grid.redCellValue) {
            cell.classList.add("red-piece");
        } else {
            cell.classList.add("yellow-piece");
        }
    }

    updateWebPageEntireGrid = (grid) => {
        for (let column = 0; column < grid.width; column++) {
            for (let line = grid.height - 1; line >= 0; line--) {
                let pos = grid.getGlobalPosition(column, line)

                let cell = document.getElementById(pos.column + "-" + pos.row);
                if (grid.cells[line][column] === Grid.redCellValue) {
                    cell.classList.add("red-piece");
                } else if (grid.cells[line][column] === Grid.yellowCellValue) {
                    cell.classList.add("yellow-piece");
                } else {
                    break;
                }
            }
        }
    }

    webPagePlayTurn = (event) => {
        let clickCoords = event.target.id.split("-");
        let column = clickCoords[1];
        let row = clickCoords[0];
        this.play(column, row); // need to send something via the socket
    }

    addAllListeners = () => {
        this.#gridListener();
        this.#giveUpListener();
    }

    removeAllListeners = () => {
        this.removeGridListeners();
        this.removeGiveUpListener();
    }

    #gridListener = () => {
        for (let column = 0; column < this.#grid.width; column++) {
            for (let line = 0; line < this.#grid.height; line++) {
                let cell = document.getElementById(column + "-" + line);
                cell.setAttribute("value", Grid.defaultCellValue);
                cell.style.cursor = "pointer";
                cell.addEventListener("click", this.webPagePlayTurn);
            }
        }
    }

    #giveUpListener = () => {
        let giveUpButton = document.getElementById("button-abandon");
        giveUpButton.addEventListener("click", this.#clickGiveUpButton);
    }

    #clickGiveUpButton = () => {
        this.#socketMatchmaking.giveUpEmit();
    }

    removeGridListeners = () => {
        document.querySelectorAll(".grid-item").forEach(c => {
            c.removeEventListener("click", this.webPagePlayTurn);
            c.style.cursor = "not-allowed";
        });
    }

    removeGiveUpListener = () => {
        let giveUpButton = document.getElementById("button-abandon");
        giveUpButton.removeEventListener("click", this.#clickGiveUpButton);
    }

    play = (clickRow, clickColumn) => {
        let column = clickColumn;
        let row = this.#grid.getRowOfLastDisk(column);
        this.#socketMatchmaking.newMoveEmit(column, row);
    }

    playerPlay = (column, row, color) => {
        this.updateWebPageGrid(column, row, color);
        this.removeGridListeners();
        this.otherPlayerTurnMessage();
        document.getElementById("timer").innerText = "Temps restant pour l'adversaire 0:10";
    }

    otherPlayerPlay = (column, row, color) => {
        this.updateWebPageGrid(column, row, color);
        this.addAllListeners();
        this.playerTurnMessage();
        document.getElementById("timer").innerText = "Temps restant pour toi 0:10";
    }

    reconnectPlayerTurn = () => {
        this.playerTurnMessage();
        this.addAllListeners();
    }

    reconnectOtherPlayerTurn = () => {
        this.otherPlayerTurnMessage();
        this.removeGridListeners();
    }

    playerTurnMessage = () => {
        this.#changeTitlePage("A ton tour");
    }

    otherPlayerTurnMessage = () => {
        this.#changeTitlePage("Au tour de l'adversaire");
    }

    waitingForOtherPlayerMessage = () => {
        this.#changeTitlePage("En attente de l'adversaire");
    }
    #changeTitlePage = (title) => {
        document.getElementById("page-title").innerText = title;
    }

    gameIsOver = (winner) => {
        let divWinner = document.getElementById("show-winner");
        let close = document.getElementById("cross");
        let winnerText = document.getElementById("winner-text");
        close.addEventListener("click", function () {
            divWinner.style.display = "none";
        });
        if (winner === "draw") {
            winnerText.innerText = "Egalité !!";
        } else {
            if (winner === parseJwt(localStorage.getItem("token")).username) {
                winnerText.innerText = "Tu as gagné !!";
                let image = document.getElementById("pic");
                image.src = "../../images/smile.png";
            } else {
                winnerText.innerText = "Tu as perdu !!";
            }
        }
        divWinner.style.display = "block";
        this.removeAllListeners();
    }

    alreadyConnectedMessage = () => {
        this.#changeTitlePage("Tu possèdes déjà une connexion en cours");
    }

    updateTimer = (time, boolean) => {
        if(boolean){
            document.getElementById("timer").innerText = "Temps restant pour toi 0:0" + time / 1000;
        }
        else{
            document.getElementById("timer").innerText = "Temps restant pour l'adversaire 0:0" + time / 1000;
        }
    }
}

export default WebPageInteraction;