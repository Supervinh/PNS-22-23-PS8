import Grid from "./Grid.js";
import GridChecker from "./GridChecker.js";
import GameState from "../DataExanges/GameState.js";


export default function GameEngine(player1, player2, gameID, debug = false) {
    // Attributes ------------------------------------------------------------------------------------------------------
    this.id = gameID;
    this.player1 = player1
    this.player2 = player2
    this.currentPlayingPlayer = player1
    this.turns = []
    this.grid = new Grid(7, 6);
    this.gridChecker = new GridChecker(this.grid);
    this.isGameOver = false;

    // Methods ---------------------------------------------------------------------------------------------------------
    this.getRandomPlayer = function (playersArray) {
        let index = Math.floor(Math.random() * playersArray.length)
        return playersArray[index]
    }

    this.getOtherPlayer = function () {
        if (this.currentPlayingPlayer === this.player1) {
            return this.player2
        } else if (this.currentPlayingPlayer === this.player2) {
            return this.player1
        } else {
            throw new Error("Invalid player");
        }
    }


    this.getOpponentPlayer = (playerId) => {
        if (this.player1.id === playerId) {
            return this.player2
        } else if (this.player2.id === playerId) {
            return this.player1
        } else {
            throw new Error("Invalid player");
        }
    }

    // Verify the end condition of the game
    this.checkWin = function (row, column, color) {
        // convert row and column to int
        row = parseInt(row);
        column = parseInt(column);
        if (this.gridChecker.checkHorizontal(row, column, color)
            || this.gridChecker.checkVertical(row, column, color)
            || this.gridChecker.checkDiagonalBottomLeftTopRight(row, column, color)
            || this.gridChecker.checkDiagonalTopRightBottomLeft(row, column, color)) {
            this.isGameOver = true;
            return true;
        }
        return false;
    }


    this.checkValidity = function (player, column) {
        // Check errors before playing
        if (player !== this.currentPlayingPlayer) {
            throw new Error("It's not your turn ");
        }
        if (column < 0 || column >= this.grid.width) {
            throw new Error("Invalid column : " + column);
        }
        if (this.grid.isColumnFull(column)) {
            throw new Error("Column " + column + " is full");
        }
        if (this.isGameOver) {
            throw new Error("Game is over");
        }
    }

    this.checkValidityMove = function (globalColumn, globalRow) {
        if (this.grid.isColumnFull(globalColumn)) {
            return false
        }
        if (globalRow < 0 || globalRow >= this.grid.width - 1 || globalColumn < 0 || this.grid >= this.grid.height) {
            return false
        }
        let cell = this.grid.getCellInGlobalCoordinated(globalRow, globalColumn)
        let defaultCell = Grid.defaultCellValue

        if (globalRow === 0) {
            if (cell === defaultCell) {
                return true
            }
        } else {
            let cellUnder = this.grid.getCellInGlobalCoordinated(globalRow - 1, globalColumn)
            return cell === defaultCell && cellUnder !== defaultCell;
        }
        return false
    }

    this.playTurn = function (player, column, row) {
        if (!this.checkValidityMove(column, row)) {
            throw new Error("Move Invalid: " + column + " " + row);
        }
        return this.playTurn(player, column);
    }

    // Play a turn for a player
    this.playTurn = function (player, column) {
        this.checkValidity(player, column);

        // Play
        let positionCell = this.grid.addDisk(player, column)
        if (debug) {
            console.log(this.grid.toString())
        }
        this.currentPlayingPlayer = this.getOtherPlayer()

        this.turns.push(column)

        // Check win condition
        if (this.checkWin(positionCell.row, positionCell.column, player.color)) {
            if (debug) {
                console.log("Game Finished : " + player.name + " won");
            }
            return new GameState(true, player.name);
        }

        // Check equality condition
        if (this.gridChecker.checkDraw()) {
            this.isGameOver = true;
            if (debug) {
                console.log("Game Finished : draw");
            }
            return new GameState(true, "draw");
        }

        // Change the current player
        return new GameState(false, null);
    }

    // Constructor -----------------------------------------------------------------------------------------------------

    player1.color = Grid.yellowCellValue;
    player2.color = Grid.redCellValue;

    // The first player is randomly chosen
    this.currentPlayingPlayer = player1;
    if (debug) {
        console.log("Players : " + player1.name + "(" + player1.color + ") and " + player2.name + "(" + player2.color + ")");
        console.log("First player : " + this.currentPlayingPlayer.name + "(" + this.currentPlayingPlayer.color + ")");
        console.log("Game ID : " + this.id);
    }
}
