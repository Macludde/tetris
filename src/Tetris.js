import Board from './game/Board.js';
import Game from './game/Game.js';

class Tetris {
    ctx;
    board;
    game;

    constructor() {
        const canvasHolder = document.getElementById("canvas-holder");
        const canvas = document.createElement("canvas");
        canvas.width = Board.pixelWidth;
        canvas.height = Board.pixelHeight;
        canvasHolder.appendChild(canvas);
        this.ctx = canvas.getContext('2d');
        this.board = new Board(this.ctx);
        this.game = new Game(this.board);
    }
}

export function createTetris() {
    return new Tetris();
}