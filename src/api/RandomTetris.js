import ControllableTetris from "./ControllableTetris.js";

export default class RandomTetris extends ControllableTetris {
    interval;

    constructor(shouldRender, onGameEnd) {
        super(shouldRender, undefined, true);
        this.onGameEnd = onGameEnd;
        this.setup();
    }

    onEnd(result) {
        super.onEnd(result);
        clearInterval(this.interval);
        this.setup();
        this.onGameEnd?.(result);
    }

    setup() {
        this.interval = setInterval(this.doAction.bind(this), 10);
        super.setup();
    }

    doAction() {
        const action = Math.floor(Math.random() * 5);
        // const action = 4; // Always hard drop
        switch (action) {
            case 0:
                this.rotate();
                break;
            case 1:
                this.moveLeft();
                break;
            case 2:
                this.moveRight();
                break;
            case 3:
                this.softDrop();
                break;
            case 4:
                this.hardDrop();
                break;
        }
        this.step();
    }
    
}