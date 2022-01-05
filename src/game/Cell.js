export default class Cell {

    static size = 25;
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