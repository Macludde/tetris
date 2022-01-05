import ControllableTetris from "./ControllableTetris";

export default class KeyboardTetris extends ControllableTetris {
    keydownHandler;
    onGameEnd;

    constructor(shouldRender, onGameEnd) {
        this.super(shouldRender, this.onEnd);
        
        this.keydownHandler = function (e) {
            if (e.key.toLowerCase() === ' ') {
                this.hardDrop();
            }
            if (!e.repeat && (e.key.toLowerCase() === 'r' || e.key.toLowerCase() === 'w')) {
                this.rotatePiece();
            }
            if (e.key.toLowerCase() === 's') {
                this.softDrop();
            }
            if (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'left') {
                this.moveHorizontal(true);
            } else if (e.key.toLowerCase() === 'd' || e.key.toLowerCase() === 'right') {
                this.moveHorizontal();
            }
        }.bind(this)
        document.addEventListener('keydown', this.keydownHandler);
    }

    onEnd(result) {
        document.removeEventListener('keydown', this.keydownHandler);
        this.onGameEnd(result);
    }
    
}