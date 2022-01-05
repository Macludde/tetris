import Board from './Board.js';
import Game from './Game.js';

export default class Tetris {
    ctx;
    board;
    game;

    constructor(shouldRender, onGameEnd) {
        let canvas;
        if (shouldRender) {
            const canvasHolder = document.getElementById("canvas-holder");
            canvas = document.createElement("canvas");
            canvas.width = Board.pixelWidth;
            canvas.height = Board.pixelHeight;
            canvasHolder.appendChild(canvas);
            this.ctx = canvas.getContext('2d');
        }

        const onEnd = (result) => {
            if (canvas) {
                const canvasHolder = document.getElementById("canvas-holder");
                canvasHolder.removeChild(canvas);
            }
            onGameEnd(result);
        }

        this.board = new Board(this.ctx);
        this.game = new Game(this.board, onEnd.bind(this));
    }
}