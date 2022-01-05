const clears = [100,300,500,800];

export default class Pieces {
    static clearedRow(amountOfRows) {
        return amountOfRows * amountOfRows * 10;
    }

    static linesRequired(level) {
        return 5*level;
    }

    static SOFT_DROP = 1;

    static HARD_DROP = 2;
}