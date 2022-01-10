import AITetris from '../api/AITetris.js'
import Board from '../game/Board.js'
import NEAT from './NEAT/NEAT.js'
import activation from './NEAT/ActivationFunction.js'
import crossover from './NEAT/Crossover.js'
import mutate from './NEAT/Mutate.js'
import Game from '../game/Game.js'


const MUTATION_RATE = 0.2;
const WORKER_SIZE = 100;
const CREATURES_PER_WORKER = 10;
const POP_SIZE = WORKER_SIZE*CREATURES_PER_WORKER;

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
 * 2-8: Current piece (0-6)
 * 9-12: Current rotation (0-3)
 * 12+: Board cells (0=empty,1=occupied)
 */
export default class AI {

    static INPUT_SIZE = 12+Board.width*Board.height
    pastTen=[];

    constructor() {
        this.config = {
            model: [
                { nodeCount: AI.INPUT_SIZE, type: 'input' },
                { nodeCount: Math.floor(AI.INPUT_SIZE*0.8), type: 'hidden', activationfunc: 'RELU' },
                { nodeCount: Math.floor(AI.INPUT_SIZE*0.8), type: 'hidden', activationfunc: 'RELU' },
                { nodeCount: Math.floor(AI.INPUT_SIZE*0.5), type: 'hidden', activationfunc: 'RELU' },
                { nodeCount: 6, type: 'output', activationfunc: 'RELU' }
            ],
            mutationRate: MUTATION_RATE,
            crossoverMethod: crossover.RANDOM,
            mutationMethod: mutate.RANDOM,
            populationSize: POP_SIZE
        }
        this.neat = new NEAT(this.config, this.gpu);

        this.tetri = [];
        this.workers = [];
        for (let i = 0; i < WORKER_SIZE; i++) {
            const worker = new Worker('src/ai/worker/Gamer.js', {
                type: 'classic'
            });
            this.workers.push(worker);
        }
        console.log('Done with workers')

        this.train();
    }

    async train() {
        console.time('iteration');
        for (let i = 0; i < Infinity; i++) {
            await this.runIteration(i);
        }
    }

    async runIteration(number) {
        return new Promise((resolve) => {
            this.results = new Array(POP_SIZE).fill(undefined);
            for (let i = 0; i < WORKER_SIZE; i++) {
                const genes = new Array(CREATURES_PER_WORKER).fill(0).map((_,index) => this.neat.creatures[i+index].flattenedGenes);
                this.workers[i].postMessage({model: this.config.model, genes });
                this.workers[i].onmessage = (e) => {
                    this.results[i*CREATURES_PER_WORKER+e.data.index] = e.data;
                    // console.log(this.results.every(result => result !== undefined))
                    if (this.results.every(result => result !== undefined)) {
                        this.finishIteration(number);
                        resolve();
                    }
                }
            }
        })
    }

    finishIteration(number) {
        let bestScore = 0;
        let highestLevel = 0;
        for (let i = 0; i < POP_SIZE; i++) {
            const {level, result} = this.results[i];
            const fitness = result+(level-1)*1000
            if (result > bestScore) {
                bestScore = result;
            }
            if (level > highestLevel) {
                highestLevel = level;
            }
            this.neat.setFitness(fitness, i);
        }
        this.pastTen.push([bestScore, highestLevel]);
        this.neat.doGen();
        if (number % 1 === 0) {
		    console.log('Generation: ' + (number + 1));
            console.timeEnd('iteration');
            console.time('iteration');
            const average = this.pastTen.reduce((a,b) => ([a[0]+b[0],a[1]+b[1]]))
            console.log('Average Best Score, Highest Level:',average[0]/this.pastTen.length, average[1]/this.pastTen.length); // Best score, highest level. Average from past 10 gens
            this.pastTen = [];

            if (number % 100 === 0 && number > 0) {
                const data = this.neat.export();
                console.log(JSON.stringify(data));
            }
        }
    }
}