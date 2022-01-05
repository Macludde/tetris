import Tetris from "../game/Tetris.js";

export default class ControllableTetris extends Tetris {

    rotate() {
        this.game.rotatePiece();
    }

    moveLeft() {
        this.game.moveHorizontal(true);
    }

    moveRight() {
        this.game.moveHorizontal(false);
    }

    softDrop() {
        this.game.softDrop();
    }

    hardDrop() {
        this.game.hardDrop();
    }
}