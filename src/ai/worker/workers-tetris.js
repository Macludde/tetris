
const pieces = [
    {
        name: 'I-block',
        color: '#00f0f0',
        startingHeight: 4,
        shape: [
            [
                [0,0],
                [0,1],
                [0,2],
                [0,3]
            ],
            [
                [2,2],
                [1,2],
                [0,2],
                [-1,2]
            ],
            [
                [-1,0],
                [-1,1],
                [-1,2],
                [-1,3]
            ],
            [
                [2,1],
                [1,1],
                [0,1],
                [-1,1]
            ],
        ],
    },
    {
        name: 'O-block',
        color: '#f0f000',
        startingHeight: 2,
        shape: [[
            [0,0],
            [0,1],
            [1,0],
            [1,1]
        ]],
    },
    {
        name: 'T-block',
        color: '#a000f0',
        startingHeight: 2,
        shape: [
            [
                [0,0],
                [0,1],
                [1,1],
                [-1,1]
            ],
            [
                [0,0],
                [0,1],
                [1,1],
                [0,2]
            ],
            [
                [0,2],
                [0,1],
                [1,1],
                [-1,1]
            ],
            [
                [0,0],
                [0,1],
                [0,2],
                [-1,1]
            ],
        ],
    },
    {
        name: 'L-block',
        color: '#f0a000',
        startingHeight: 3,
        shape: [
            [
                [0,0],
                [0,1],
                [0,2],
                [1,2]
            ],
            [
                [0,1],
                [1,1],
                [-1,1],
                [-1,2]
            ],
            [
                [0,0],
                [-1,0],
                [0,1],
                [0,2]
            ],
            [
                [1,0],
                [0,1],
                [1,1],
                [-1,1]
            ],
        ],
    },
    {
        name: 'J-block',
        color: '#0000f0',
        startingHeight: 3,
        shape: [
            [
                [0,0],
                [1,0],
                [0,1],
                [0,2]
            ],
            [
                [0,1],
                [1,1],
                [-1,1],
                [1,2]
            ],
            [
                [0,0],
                [0,1],
                [0,2],
                [-1,2]
            ],
            [
                [-1,0],
                [0,1],
                [1,1],
                [-1,1]
            ],
        ],
    },
    {
        name: 'Z-block',
        color: '#00f000',
        startingHeight: 2,
        shape: [
            [
                [0,0],
                [0,1],
                [1,1],
                [1,2]
            ],
            [
                [0,1],
                [1,1],
                [0,2],
                [-1,2]
            ],
            [
                [-1,0],
                [-1,1],
                [0,1],
                [0,2]
            ],
            [
                [0,0],
                [0,1],
                [1,0],
                [-1,1]
            ],
        ],
    },
    {
        name: 'Z-block',
        color: '#f00000',
        startingHeight: 2,
        shape: [
            [
                [1,0],
                [0,1],
                [1,1],
                [0,2]
            ],
            [
                [0,1],
                [-1,1],
                [0,2],
                [1,2]
            ],
            [
                [0,0],
                [-1,1],
                [0,1],
                [-1,2]
            ],
            [
                [-1,0],
                [0,0],
                [0,1],
                [1,1]
            ],
        ],
    },
]


const namesToIndices = {}
for (let i = 0; i < pieces.length; i++) {
    namesToIndices[pieces[i].name] = i;
}

class Cell {

    static size = 4;
    static DEFAULT_COLOR = '#ddd';
    static STROKE_COLOR = '#ccc';

    x;
    y;
    color;
    isOccupied;
    ctx;
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        if (ctx !== undefined) {
            this.clear()
        }
    }

    /**
     * PRIVATE. Draws the cell with the current color
     */
    _draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, Cell.size, Cell.size);
        this.ctx.strokeRect(this.x, this.y, Cell.size, Cell.size);
    }


    /**
     * Draws given color to cell and marks it as occupied
     * @param {HTML Color String} color
     */
    setColor(color) {
        this.color = color;
        this._draw();
    }

    setOccupied() {
        this.isOccupied = true;
    }

    /**
     * Clears the cell
     */
    clear() {
        this.isOccupied = false;
        this.color = Cell.DEFAULT_COLOR;
        this._draw()
    }
}

class Board {
    static width = 10;
    static height = 20;
    static cellCount = this.width*this.height;
    static pixelWidth = this.width*Cell.size;
    static pixelHeight = this.height*Cell.size;

    ctx;
    cells;

    constructor(ctx) {
        this.ctx = ctx;
        this.cells = [];
        if (this.ctx !== undefined) {
            this.ctx.strokeStyle = Cell.STROKE_COLOR;
        }

        for (let col = 0; col < Board.width; col++) {
            this.cells.push([])
            for (let row = 0; row < Board.height; row++) {
                this.cells[col].push(new Cell(ctx, col*Cell.size, row*Cell.size))
            }
        }
    }

    _shouldDraw() {
        return this.ctx !== undefined;
    }

    clear(x,y) {
        this.cells[x][y].clear();
    }

    draw(x,y,color) {
        this.cells[x][y].setColor(color);
    }

    clearMany(positions) {
        if (this._shouldDraw()) {
            for (let pos of positions) {
                this.clear(pos[0], pos[1]);
            }
        }
    }

    drawMany(positions, color) {
        if (this._shouldDraw()) {
            for (let pos of positions) {
                this.draw(pos[0],pos[1], color);
            }
        }
    }

    isCellOccupied(x,y) {
        return this.cells[x][y].isOccupied;
    }

    setCellsOccupied(positions) {
        for (let pos of positions) {
            this.cells[pos[0]][pos[1]].isOccupied = true;
        }
    }

    /**
     * Checks if all cells in row are occupied
     * @param {number} row index of row
     */
    isRowFull(row) {
        for (let col = 0; col < Board.width; col++) {
            if (!this.cells[col][row].isOccupied) {
                return false;
            }
        }
        return true;
    }

    /**
     * Clears cells in row and move all above down
     * @param {number} row index of row 
     */
    clearRow(row) {
        for (let col = 0; col < Board.width; col++) {
            for (let i = row; i > 0; i--) {
                this.cells[col][i].setColor(this.cells[col][i-1].color)
                this.cells[col][i].isOccupied = this.cells[col][i-1].isOccupied;
            }
        }
    }

    /**
     * Removes multiple rows at once (more efficient than clearing one row at a time)
     * @param {number} startRow index of bottom row (largest number)
     * @param {number} endRow index of top row (smallest number)
     */
    clearManyRows(startRow, endRow) {
        const diff = startRow-endRow
        for (let col = 0; col < Board.width; col++) {
            for (let i = startRow; i > diff; i--) {
                this.cells[col][i].setColor(this.cells[col][i-1-diff].color);
                this.cells[col][i].isOccupied = this.cells[col][i-1-diff].isOccupied;
            }
            for (let i = diff; i > 0; i--) {
                this.cells[col][i].clear();
            }
        }
    }
}

class Piece {
    static PIECES = pieces

    board;
    x;
    y;
    name;
    shape;
    color;
    rotation = 0;


    constructor(board, pieceIndex) {
        const piece = Piece.PIECES[pieceIndex];
        this.x = Board.width/2 - 1;
        // DEBUG LINE
        /* if (piece.name === 'T-block') {
            this.x = Math.floor(Math.random()*(Board.width-3))+1;
        } else {
            this.x = Math.floor(Math.random()*(Board.width-1));
        } */
        this.y = -piece.startingHeight;
        this.board = board;
        this.name = piece.name;
        this.shape = piece.shape;
        this.color = piece.color;
        this._draw();
    }

    _getPositions() {
        const positions = this.shape[this.rotation].map(pos => ([this.x+pos[0], this.y+pos[1]]));
        return positions;
    }

    getPositions() {
        const positions = this._getPositions();
        if (this.y < 0) {
            return positions.filter(pos => pos[1] >= 0);
        }
        return positions;
    }

    _clear() {
        this.board.clearMany(this.getPositions());
    }

    _draw() {
        this.board.drawMany(this.getPositions(), this.color);

    }

    /**
     * Moves piece horizontally
     * @param {boolean} left true if to move left, false if to move right 
     * @returns true if move was successful
     */
    moveHorizontal(left=false) {
        const upcomingPositions = this._getPositions().map(pos => ([pos[0] + (left ? -1 : 1), pos[1]]))
        if (upcomingPositions.some(pos => 
            pos[0] < 0 || pos[0] >= Board.width || (pos[1] >= 0 && this.board.isCellOccupied(pos[0],pos[1]))
        )) {
            return false;
        }
        this._clear()
        this.x += left ? -1 : 1;
        this._draw()
        return true;
    }

    /**
     * Moves piece down
     * @returns returns true if piece lands on bottom or another piece
     */
    moveDown() {
        const upcomingPositions = this.getPositions().map(pos => ([pos[0], pos[1]+1]))
        if (upcomingPositions.some(pos =>
            pos[1] >= Board.height || this.board.isCellOccupied(pos[0],pos[1]) 
        )) {
            // Has landed
            return true;
        }

        this._clear()
        this.y++;
        this._draw()
        return false;
    }

    rotate() {
        const newRotation = (this.rotation + 1) % this.shape.length;
        let extraMovementNecessary = [0,0]
        let upcomingPositions = this.shape[newRotation].map(pos => ([this.x+pos[0], this.y+pos[1]]))
        if (upcomingPositions.some(pos => 
                pos[0] < 0 || pos[0] >= Board.width
        )) {
            let lowestX = 0, 
                highestX = Board.width-1;
                // highestY = Board.height-1;
            upcomingPositions.forEach(pos => {
                if (pos[0] < lowestX ) {
                    lowestX = pos[0];
                } else if (pos[0] > highestX) {
                    highestX = pos[0];
                } 
                // if (pos[1] > highestY) {
                //     highestY = pos[1];
                // }
            })
            let xDiff = 0;
            if (lowestX < 0) {
                xDiff = lowestX;
            } else if (highestX >= Board.width) {
                xDiff = highestX - Board.width + 1;
            }
            // const yDiff = highestY >= Board.height ? highestY - Board.height + 1 : 0;
            upcomingPositions = upcomingPositions.map(pos => ([pos[0] - xDiff, 0/*  pos[1] - yDiff */]));
            extraMovementNecessary = [-xDiff, 0/* -yDiff */]
        }
        if (upcomingPositions.filter(pos => pos[1] >= 0).some(pos => pos[1] >= Board.height || this.board.isCellOccupied(pos[0],pos[1]))) {
                 return false;
        }
        this._clear()
        this.rotation = newRotation
        this.x += extraMovementNecessary[0];
        this.y += extraMovementNecessary[1];
        this._draw()
    }

}

const clears = [100,300,500,800];

class Score {
    static clearedRow(amountOfRows) {
        return amountOfRows * amountOfRows * 10;
    }

    static linesRequired(level) {
        return 5*level;
    }

    static SOFT_DROP = 1;

    static HARD_DROP = 2;
}

class Game {
    score = 0; // Keeps track of users score
    upcomingPieces = []; // Array of next 3 piece indices
    currentPiece;
    level = 1;
    linesCleared = 0;
    static GAME_FRAME_DELAY = 40;

    constructor(board) {
        this.board = board;
        this._generateLaterPiece();
        this._generateLaterPiece();
        this._generateLaterPiece();
        this._setNextPiece();
        this._generateLaterPiece();
        this.isRunning = true;
        
    }

    hardDrop()
    {
        while (!this.onUpdate())
        {
            this.score += Score.HARD_DROP;
        }
    }

    softDrop() {
        this.score += Score.SOFT_DROP;
        this.onUpdate()
    }

    moveHorizontal(left) {
        this.currentPiece.moveHorizontal(left);
    }

    rotatePiece() {
        this.currentPiece.rotate();
    }

    _generateLaterPiece() {
        this.upcomingPieces.push(Math.floor(Math.random() * Piece.PIECES.length));
    }

    _setNextPiece() {
        this.currentPiece = new Piece(this.board, this.upcomingPieces.shift());
    }

    _addClearedLines(lines) {
        this.linesCleared += lines;
        const linesRequired = Score.linesRequired(this.level)
        if (this.linesCleared >= linesRequired) {
            this.linesCleared -= linesRequired;
            this.level++;
        }
    }

    endGame() {
        this.isRunning = false;
    }

    onPlacement() {
        // TODO: Add score
        if (this.currentPiece.y < 0) {
            this.endGame();
            return;
        }
        const finalPositions = this.currentPiece.getPositions();
        this.board.setCellsOccupied(finalPositions);
        const updatedRows = finalPositions
                                    .map(pos => pos[1])
                                    .filter((row, i, arr) => arr.indexOf(row) === i)
        const completedRows = updatedRows
                                .filter((row) => this.board.isRowFull(row))
                                .sort((a, b) => b - a);
        if (completedRows.length > 0) {
            // TODO: Add score
            if (completedRows.length === 1) {
                this.board.clearRow(completedRows[0]);
            } else {
                this.board.clearManyRows(completedRows[0], completedRows[completedRows.length-1]);
            }
        }
        this._setNextPiece();
        this._generateLaterPiece();
    }

    onUpdate() {
        if (!this.isRunning) return;
        // DEBUG LINE
        // this.rotatePiece()
        if (this.currentPiece.moveDown()) {
            this.onPlacement();
            return true;
        }
        return false;
    }
}

class Tetris {
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
    }

    step() {
        this.game.onUpdate();
        if (!this.game.isRunning) {
            this.onEnd(this.game.score);
        }
    }

    onEnd(result) {
        this.onGameEnd?.(result);
        if (!this.stepManually) {
            clearInterval(this.updateInterval);
        }
    }

    setup() {
        if (!this.stepManually) {
            this.updateInterval = setInterval(this.step.bind(this), Game.GAME_FRAME_DELAY)
        }
        this.board = new Board(this.ctx);
        this.game = new Game(this.board);
    }
}

class ControllableTetris extends Tetris {

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


class AITetris extends ControllableTetris {

    constructor(shouldRender) {
        super(shouldRender, undefined, true);
        this.result = undefined;
    }

    onEnd(result) {
        super.onEnd(result);
        this.result = result;
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


