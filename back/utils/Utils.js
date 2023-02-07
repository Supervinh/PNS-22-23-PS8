// We normally don't need to use this function

import {Position} from "../../front/GameLogic/Position.js";

export function convertLocalPositionToAPI(position) {
    return new Position(position.x, this.height - 1 - position.y);
}

export function convertAPIPositionToLocal(position) {
    return new Position(position.x, this.height - 1 - position.y);
}

export function convertLocalGridToAPI(grid) {
    let apiGrid = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
        apiGrid[i] = new Array(this.width);
        for (let j = 0; j < this.width; j++) {
            apiGrid[i][j] = grid[this.height - 1 - i][j];
        }
    }
    return apiGrid;
}

export function convertAPIGridToLocal(grid) {
    let localGrid = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
        localGrid[i] = new Array(this.width);
        for (let j = 0; j < this.width; j++) {
            localGrid[i][j] = grid[this.height - 1 - i][j];
        }
    }
    return localGrid;
}