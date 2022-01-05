import Board from './game/Board.js';
import Game from './game/Game.js';

class Tetris {
    ctx;
    board;
    game;
    canvas;

    constructor(onGameEnd) {
        const canvasHolder = document.getElementById("canvas-holder");
        this.canvas = document.createElement("canvas");
        this.canvas.width = Board.pixelWidth;
        this.canvas.height = Board.pixelHeight;
        canvasHolder.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.board = new Board(this.ctx);
        this.game = new Game(this.board, onGameEnd);
    }

    remove() {
        const canvasHolder = document.getElementById("canvas-holder");
        canvasHolder.removeChild(this.canvas);
    }
}

export function createTetris() {
    return new Promise((resolve, reject) => {
        let tetris;
        const onDone = (result) => {
            tetris.remove();
            resolve(result)
        }
        tetris = new Tetris(onDone);
    });
}