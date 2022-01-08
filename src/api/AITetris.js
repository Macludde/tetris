import pieces from "../game/pieces.js";
import ControllableTetris from "./ControllableTetris.js";

const namesToIndices = {}
for (let i = 0; i < pieces.length; i++) {
    namesToIndices[pieces[i].name] = i;
}

export default class AITetris extends ControllableTetris {

    constructor(shouldRender) {
        super(shouldRender, (result) => {
            this.result = result;
        });
        this.result = undefined;
    }

    setup() {
        super.setup();
        this.result = undefined;
    }

    getInputs() {
        const inputs = new Array(12).fill(0)
        inputs[0] = this.game.currentPiece.x;
        inputs[1] = this.game.currentPiece.y;
        const currentPiece = namesToIndices[this.game.currentPiece.name];
        const rotation = this.game.currentPiece.rotation;
        inputs[2+currentPiece] = 1;
        inputs[8+rotation] = 1;
        const cells = this.getCellStates();
        return [...inputs, ...cells];
    }

    getCellStates() {
        return this.game.board.cells
            .flatMap(row => 
                row.map(cell => cell.isOccupied ? 1 : 0)
            )
    }

    doAction(actionIndex) {
        if (this.result !== undefined) return;
        switch (actionIndex) {
            case 0:
                break;
            case 1:
                this.moveLeft();
                break;
            case 2:
                this.moveRight();
                break;
            case 3:
                this.rotate();
                break;
            case 4:
                this.softDrop();
                break;
            case 5:
                this.hardDrop();
                break;
        }
    }
}