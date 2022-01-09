import Board from './Board.js';
import Game from './Game.js';

export default class Tetris {
    ctx;
    board;
    game;

    constructor(shouldRender, onGameEnd, stepManually) {
        if (shouldRender) {
            const canvasHolder = document.getElementById("canvas-holder");
            let canvas = document.createElement("canvas");
            canvas.width = Board.pixelWidth;
            canvas.height = Board.pixelHeight;
            canvasHolder.appendChild(canvas);
            this.ctx = canvas.getContext('2d');
        }
        this.onGameEnd = onGameEnd;
        this.stepManually = stepManually;
        this.setup();
    }

    step() {
        this.game.onUpdate();
    }

    setup() {
        if (!this.stepManually) {
            this.updateInterval = setInterval(this.step.bind(this), Game.GAME_FRAME_DELAY)
        }
        this.board = new Board(this.ctx);
        this.game = new Game(this.board, (result) => {
            this.onGameEnd(result);
            if (!this.stepManually) {
                clearInterval(this.updateInterval);
            }
        });
    }
}