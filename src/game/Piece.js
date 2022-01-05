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
        if (upcomingPositions.some(pos => 
            pos[0] < 0 || pos[0] >= Board.width || this.board.isCellOccupied(pos[0],pos[1])
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
        let upcomingPositions = this.shape[newRotation].map(pos => ([this.x+pos[0], this.y+pos[1]]));
        if (upcomingPositions.some(pos => 
                pos[0] < 0 || pos[0] >= Board.width || pos[1] >= Board.height
        )) {
            let lowestX = 0, 
                highestX = Board.width-1, 
                highestY = Board.height-1;
            upcomingPositions.forEach(pos => {
                if (pos[0] < lowestX ) {
                    lowestX = pos[0];
                } else if (pos[0] > highestX) {
                    highestX = pos[0];
                } 
                if (pos[1] > highestY) {
                    highestY = pos[1];
                }
            })
            let xDiff = 0;
            if (lowestX < 0) {
                xDiff = lowestX;
            } else if (highestX >= Board.width) {
                xDiff = highestX - Board.width + 1;
            }
            const yDiff = highestY >= Board.height ? highestY - Board.height + 1 : 0;
            upcomingPositions = upcomingPositions.map(pos => ([pos[0] - xDiff, pos[1] - yDiff]));
            extraMovementNecessary = [-xDiff, -yDiff]
        }
        if (upcomingPositions.some(pos => this.board.isCellOccupied(pos[0],pos[1]))) {
                 return false;
        }
        this._clear()
        this.rotation = newRotation
        this.x += extraMovementNecessary[0];
        this.y += extraMovementNecessary[1];
        this._draw()
    }

}