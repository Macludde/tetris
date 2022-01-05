import Board from './Board.js';
import pieces from './pieces.js';

export default class Piece {
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
        this.x = Board.width/2;
        this.y = -piece.startingHeight;
        this.board = board;
        this.name = piece.name;
        this.shape = piece.shape;
        this.color = piece.color;
        this._draw();
    }

    getPositions() {
        const positions = this.shape[this.rotation].map(pos => ([this.x+pos[0], this.y+pos[1]]));
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
        const upcomingPositions = this.getPositions().map(pos => ([pos[0] + (left ? -1 : 1), pos[1]]))
        if (upcomingPositions.some(pos => {
            return pos[0] < 0 || pos[0] >= Board.width || this.board.isCellOccupied(pos[0],pos[1])
        })) {
            console.log(upcomingPositions)
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
        if (upcomingPositions.some(pos => {
            return pos[1] >= Board.height || this.board.isCellOccupied(pos[0],pos[1]) 
        })) {
            // Has landed
            return true;
        }

        this._clear()
        this.y++;
        this._draw()
        return false;
    }

    rotate() {
        this._clear()
        this.rotation = (this.rotation + 1) % this.shape.length;
        this._draw()
    }

}