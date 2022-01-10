import ControllableTetris from "./ControllableTetris.js";

export default class KeyboardTetris extends ControllableTetris {
    keydownHandler;
    onGameEnd;

    constructor(onGameEnd) {
        super(true, (result) => {
            this.onGameEnd(result);
            document.removeEventListener('keydown', this.keydownHandler);
        });
        this.onGameEnd = onGameEnd;

        this.keydownHandler = (e) => {
            if (e.key.toLowerCase() === ' ') {
                this.hardDrop();
            }
            if (!e.repeat && (e.key.toLowerCase() === 'r' || e.key.toLowerCase() === 'w')) {
                this.rotate();
            }
            if (e.key.toLowerCase() === 's') {
                this.softDrop();
            }
            if (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'left') {
                this.moveLeft();
            } else if (e.key.toLowerCase() === 'd' || e.key.toLowerCase() === 'right') {
                this.moveRight();
            }
        }
        document.addEventListener('keydown', this.keydownHandler.bind(this));
        this.setup();
    }

    onEnd(result) {
        super.onEnd(result);
        this.setup();
    }
    
}