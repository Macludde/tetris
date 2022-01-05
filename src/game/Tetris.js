import Board from './Board.js';
import Game from './Game.js';

export default class Tetris {
    ctx;
    board;
    game;
    canvas;

    constructor(shouldRender, onGameEnd) {
        if (shouldRender) {
            const canvasHolder = document.getElementById("canvas-holder");
            this.canvas = document.createElement("canvas");
            this.canvas.width = Board.pixelWidth;
            this.canvas.height = Board.pixelHeight;
            canvasHolder.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }
        this.board = new Board(this.ctx);
        this.game = new Game(this.board, onGameEnd);
    }

    remove() {
        if (this.canvas) {
            const canvasHolder = document.getElementById("canvas-holder");
            canvasHolder.removeChild(this.canvas);
        }
    }
}