import pieces from "../game/pieces.js";
import Tetris from "../game/Tetris.js";

const namesToIndices = {}
for (let i = 0; i < pieces.length; i++) {
    namesToIndices[pieces[i].name] = i;
}

export default class AITetris extends Tetris {

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
        const xPos = this.game.currentPiece.x;
        const yPos = this.game.currentPiece.y;
        const currentPiece = namesToIndices[this.game.currentPiece.name];
        const rotation = this.game.currentPiece.rotation;
        const cells = this.getCellStates();
        return [xPos, yPos, currentPiece, rotation, ...cells];
    }

    getCellStates() {
        return this.game.board.cells
            .flatMap(row => 
                row.map(cell => cell.isOccupied ? 1 : 0)
            )
    }

    doAction(actionIndex) {
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