import Piece from './Piece.js';

export default class Game {
    board;
    score = 0; // Keeps track of users score
    upcomingPieces = []; // Array of next 3 piece indices
    currentPiece;
    shouldRotate;
    onGameEnd;
    score;
    updateInterval;
    keydownHandler;

    constructor(board, onGameEnd) {
        this.board = board;
        this.onGameEnd = onGameEnd;
        this.score = 0;
        this._generateLaterPiece();
        this._generateLaterPiece();
        this._generateLaterPiece();
        this._setNextPiece();
        this._generateLaterPiece();

        this.updateInterval = setInterval(() => {
            this.onUpdate();
        }, 0)

        this.keydownHandler = function (e) {
            if (e.key.toLowerCase() === ' ') {
                while (!this.onUpdate());
            }
            if (!e.repeat && (e.key.toLowerCase() === 'r' || e.key.toLowerCase() === 'w')) {
                this._rotatePiece();
            }
            if (e.key.toLowerCase() === 's') {
                this.onUpdate()
            }
            if (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'left') {
                this.currentPiece.moveHorizontal(true);
            } else if (e.key.toLowerCase() === 'd' || e.key.toLowerCase() === 'right') {
                this.currentPiece.moveHorizontal();
            }
        }.bind(this)
        document.addEventListener('keydown', this.keydownHandler);
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
        if (this.currentPiece.y < 0) {
            clearInterval(this.updateInterval);
            document.removeEventListener('keydown', this.keydownHandler);
            this.onGameEnd(this.score);
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
        // DEBUG LINE
        // this._rotatePiece()
        if (this.currentPiece.moveDown()) {
            this.onPlacement();
            return true;
        }
        return false;
    }
}