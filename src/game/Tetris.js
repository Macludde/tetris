import Board from './Board.js';
import Game from './Game.js';

export default class Tetris {
    ctx;
    board;
    game;

    constructor(shouldRender, onGameEnd) {
        if (shouldRender) {
            const canvasHolder = document.getElementById("canvas-holder");
            let canvas = document.createElement("canvas");
            canvas.width = Board.pixelWidth;
            canvas.height = Board.pixelHeight;
            canvasHolder.appendChild(canvas);
            this.ctx = canvas.getContext('2d');
        }
        this.onGameEnd = onGameEnd;
        this.setup();
    }

    setup() {
        this.board = new Board(this.ctx);
        this.game = new Game(this.board, this.onGameEnd);
    }
}