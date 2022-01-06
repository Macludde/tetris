import AITetris from '../api/AITetris.js'
import Board from '../game/Board.js'
import NEAT from './NEAT/NEAT.js'
import activation from './NEAT/ActivationFunction.js'
import crossover from './NEAT/Crossover.js'
import mutate from './NEAT/Mutate.js'


const MUTATION_RATE = 0.9;
const POP_SIZE = 10;

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
        const config = {
            model: [
                { nodeCount: 4+Board.width*Board.height, type: 'input' },
                { nodeCount: 6, type: 'output', activationfunc: activation.SOFTMAX }
            ],
            mutationRate: MUTATION_RATE,
            crossoverMethod: crossover.RANDOM,
            mutationMethod: mutate.RANDOM,
            populationSize: POP_SIZE
        }
        this.neat = new NEAT(config);

        this.tetri = [];
        for (let i = 0; i < POP_SIZE; i++) {
            this.tetri.push(new AITetris(true));
        }

        this.iteration(0)
    }

    iteration(number) {
        for (let i = 0; i < POP_SIZE; i++) {
            this.neat.setInputs(this.tetri[i].getInputs(), i);
        }
        this.neat.feedForward();
        const decisions = this.neat.getDecisions();
        for (let i = 0; i < POP_SIZE; i++) {
            // get index of largest value
            this.tetri[i].doAction(decisions[i]);
        }
        let finish = this.tetri.every(tetri => tetri.result !== undefined);
        if (finish) {
            console.log('FINISH ' + number);
            this.neat.feedForward();
            for (let i = 0; i < POP_SIZE; i++) {
                this.neat.setFitness(this.tetri[i].result, i);
            }
            this.neat.doGen();
            for (let i = 0; i < POP_SIZE; i++) {
                this.tetri[i].setup();
            }
            this.iteration(number+1);
        } else {
            setTimeout(() => {
                this.iteration(number)
            }, 10);
        }
    }
}