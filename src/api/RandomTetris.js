import ControllableTetris from "./ControllableTetris.js";

export default class RandomTetris extends ControllableTetris {
    interval;

    constructor(shouldRender, onGameEnd) {
        super(shouldRender, (result) => {
            clearInterval(this.interval);
            onGameEnd?.(result);
        });

        
    }

    setup() {
        this.interval = setInterval(this.doAction.bind(this), 10);
        super.setup();
    }

    doAction() {
        // const action = Math.floor(Math.random() * 5);
        const action = 4;
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
    }
    
}