import Cell from './Cell.js';

export default class Board {
    static width = 10;
    static height = 15;
    static pixelWidth = this.width*Cell.size;
    static pixelHeight = this.height*Cell.size;

    ctx;
    cells;

    constructor(ctx) {
        this.ctx = ctx;
        this.cells = [];

        for (let col = 0; col < Board.width; col++) {
            this.cells.push([])
            for (let row = 0; row < Board.height; row++) {
                this.cells[col].push(new Cell(ctx, col*Cell.size, row*Cell.size))
            }
        }
    }

    clear(x,y) {
        this.cells[x][y].clear();
    }

    draw(x,y,color) {
        this.cells[x][y].setColor(color);
    }

    clearMany(positions) {
        for (let pos of positions) {
            this.clear(pos[0], pos[1]);
        }
    }

    drawMany(positions, color) {
        for (let pos of positions) {
            this.draw(pos[0],pos[1], color);
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