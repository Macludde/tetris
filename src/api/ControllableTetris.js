import Tetris from "../game/Tetris";

export default class ControllableTetris extends Tetris {

    rotate() {
        this.game.rotatePiece();
    }

    moveLeft() {
        this.game.moveHorizontal(true);
    }

    moveRight() {
        this.game.moveHorizontal(true);
    }

    softDrop() {
        this.game.softDrop();
    }

    hardDrop() {
        this.game.hardDrop();
    }
}