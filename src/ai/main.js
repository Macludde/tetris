import AITetris from '../api/AITetris.js'
import Board from '../game/Board.js'
import { Population } from './NEAT/NEAT.js';



const MUTATION_RATE = 0.9;
const POP_SIZE = 10;
const GENERATIONS = 300;

/**
 * ACTIONS:
 * 0: Nothing
 * 1: Move Left
 * 2: Move Right
 * 3: Rotate
 * 4: Soft Drop
 * 5: Hard Drop
 * 
 * INPUTS:
 * 0: Current X position
 * 1: Current Y position
 * 2: Current piece (0-6)
 * 3: Current rotation (0-3)
 * Rest: Board cells (0=empty,1=occupied)
 */
export default class AI {

    constructor() {
        this.neat = Population({
            inputs: 4+Board.cellCount,
            outputs: 6,
            popSize: POP_SIZE,
        })

        this.tetri = [];
        for (let i = 0; i < POP_SIZE; i++) {
            this.tetri.push(new AITetris(true));
        }

        for (let g = 0; g < GENERATIONS; g++) {
            // for (let i = 0; i < POP_SIZE; i++) {
            //     this.tetri[i].setup();
            // }
            this.iteration(g);
        }
    }

    iteration(number) {
        for (let i = 0; i < POP_SIZE; i++) {
            const inputs = this.tetri[i].getInputs();
            const outputs = this.neat.population[i].feedForward(inputs);
            // console.log(outputs);
            const maxOutputIndex = outputs.indexOf(Math.max(...outputs));
            this.tetri[i].doAction(maxOutputIndex);
        }
        const isFinished = this.tetri.every(t => t.score !== undefined);
        if (isFinished) {
            console.log(`Generation ${number}`);
           
            for (let i = 0; i < POP_SIZE; i++) {
                const score = this.tetri[i].score;
                this.neat.population[i].fitness = score;
            }

            this.neat.doGeneration();
        }
        setTimeout(() => {
            this.iteration(number);
        }, 100);
    }
}