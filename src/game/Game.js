import Piece from './Piece.js';
import Score from './Score.js';

export default class Game {
    score = 0; // Keeps track of users score
    upcomingPieces = []; // Array of next 3 piece indices
    currentPiece;
    level = 1;
    linesCleared = 0;
    static GAME_FRAME_DELAY = 400;

    constructor(board) {
        this.board = board;
        this.setup();
        
    }

    setup() {
        this.board.setup();
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