import pieces from './pieces.js';

export default class Game {
    board;
    score = 0; // Keeps track of users score
    upcomingPieces = []; // Array of next 3 pieces
    currentPiece;

    constructor(board) {
    }

    _generateLaterPiece() {
        this.upcomingPieces.push(pieces[Math.floor(Math.random() * pieces.length)]);
    }

    _setNextPiece() {
        this.currentPiece = this.upcomingPieces.shift();
    }

    onPlacement() {
        this._setNextPiece();
        this._generateLaterPiece();
    }

    onUpdate() {
        
    }
}