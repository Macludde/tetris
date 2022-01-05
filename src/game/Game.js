import Piece from './Piece.js';

export default class Game {
    board;
    score = 0; // Keeps track of users score
    upcomingPieces = []; // Array of next 3 piece indices
    currentPiece;
    shouldRotate;

    constructor(board) {
        this.board = board;
        this._generateLaterPiece();
        this._generateLaterPiece();
        this._generateLaterPiece();
        this._setNextPiece();
        this._generateLaterPiece();

        setInterval(() => {
            this.onUpdate();
        }, 400)

        document.addEventListener('keydown', function (e) {
            if (!e.repeat && (e.key.toLowerCase() === 'r' || e.key.toLowerCase() === 'w')) {
                this._rotatePiece();
            }
            if (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'left') {
                this.currentPiece.moveHorizontal(true);
            } else if (e.key.toLowerCase() === 'd' || e.key.toLowerCase() === 'right') {
                this.currentPiece.moveHorizontal();
            } else if (e.key.toLowerCase() === 's') {
                this.onUpdate()
            }
        }.bind(this));   
    }

    _rotatePiece() {
        this.currentPiece.rotate();
    }

    _generateLaterPiece() {
        this.upcomingPieces.push(Math.floor(Math.random() * Piece.PIECES.length));
    }

    _setNextPiece() {
        this.currentPiece = new Piece(this.board, this.upcomingPieces.shift());
    }

    onPlacement() {
        // TODO: Add score
        const finalPositions = this.currentPiece.getPositions();
        this.board.setCellsOccupied(finalPositions);
        const completedRows = finalPositions
                                    .map(pos => pos[1])
                                    .filter((row, i, arr) => arr.indexOf(row) === i)
                                    .filter((row) => this.board.isRowFull(row))
                                    .sort((a, b) => b - a);
        console.log(completedRows);
        if (completedRows.length > 0) {
            // TODO: Add score
            if (completedRows.length === 1) {
                this.board.clearRow(completedRows[0]);
            } else {
                this.board.clearManyRows(completedRows[0], completedRows[1]);
            }
        }
        this._setNextPiece();
        this._generateLaterPiece();
    }

    onUpdate() {
        if (this.currentPiece.moveDown()) {
            this.onPlacement();
        }
    }
}