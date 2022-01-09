import AITetris from '../api/AITetris.js'
import Board from '../game/Board.js'
import NEAT from './NEAT/NEAT.js'
import activation from './NEAT/ActivationFunction.js'
import crossover from './NEAT/Crossover.js'
import mutate from './NEAT/Mutate.js'
import Game from '../game/Game.js'


const MUTATION_RATE = 0.5;
const POP_SIZE = 500;

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

    constructor() {
        const layerSizes = [AI.INPUT_SIZE, Math.floor(AI.INPUT_SIZE/2), Math.floor(AI.INPUT_SIZE/2), 6]
        const config = {
            model: [
                { nodeCount: AI.INPUT_SIZE, type: 'input' },
                { nodeCount: Math.floor(AI.INPUT_SIZE/2), type: 'hidden', activationfunc: activation.SIGMOID  },
                { nodeCount: Math.floor(AI.INPUT_SIZE/2), type: 'hidden', activationfunc: activation.SIGMOID  },
                { nodeCount: 6, type: 'output', activationfunc: activation.SIGMOID }
            ],
            mutationRate: MUTATION_RATE,
            crossoverMethod: crossover.RANDOM,
            mutationMethod: mutate.RANDOM,
            populationSize: POP_SIZE
        }
        this.gpu = new GPU();
        this.neat = new NEAT(config, this.gpu);

        this.tetri = [];
        for (let i = 0; i < POP_SIZE; i++) {
            this.tetri.push(new AITetris(true));
        }

        // console.log(this.neat.getWeights()[0]);


        const getMatrixMult = (layer) => {
            return this.gpu.createKernel(function(weights, inputs) {
                let sum = weights[0][this.thread.x]; // Bias
                for (let j = 1; j < this.constants.previousSize; j++) {
                    sum += weights[j][this.thread.x] * inputs[j-1];
                }
                const sigmoid = (1 / (1 + Math.exp(-sum)))
                return sigmoid
            }, {
                constants: {previousSize: layerSizes[layer-1]},
                output: [layerSizes[layer]]
            })
        }

        this.getActions = (network, inputs) => {
            let currentValues = inputs;
            for (let n = 0; n < network.length-1; n++) {
                // console.log(network[n])
                currentValues = matrixMultFunctions[n+1](network[n], currentValues);
                // console.log(currentValues)
            }
            return currentValues
        }
        

        this.getAllActions = (networks, inputs) => {
            let values = [];
            for (let p = 0; p < POP_SIZE; p++) {
                values.push(this.getActions(networks[p], inputs[p]));
            }

            const largestValueIndex = values.map(v => v.indexOf(Math.max(...v)));
            
            return largestValueIndex
        }

        console.time('iteration');
        this.iteration(0)
    }

    async iteration(number) {
        for (let i = 0; i < POP_SIZE; i++) {
            this.neat.setInputs(this.tetri[i].getInputs(), i);
        }
        this.neat.feedForward();
        const decisions = this.neat.getDecisions();
        for (let i = 0; i < POP_SIZE; i++) {
            // get index of largest value
            this.tetri[i].doAction(decisions[i]);
        }


        // console.timeEnd('iteration');
        let finish = this.tetri.every(tetri => tetri.result !== undefined);
        if (finish) {
            console.timeEnd('iteration');
            console.log('FINISH ' + number);
            let bestScore = 0;
            let highestLevel = 0;
            for (let i = 0; i < POP_SIZE; i++) {
                const level = this.tetri[i].game.level;
                const fitness = this.tetri[i].result+(level-1)*1000
                if (this.tetri[i].result > bestScore) {
                    bestScore = this.tetri[i].result;
                }
                if (level > highestLevel) {
                    highestLevel = level;
                }
                this.tetri[i].setup();
                this.neat.setFitness(fitness, i);
            }
            console.log(bestScore, highestLevel);
            this.neat.doGen();
            if (number % 100 === 0) {
                const data = this.neat.export();
                console.log(JSON.stringify(data));
            }
            console.time('iteration');
            this.iteration(number+1);
        } else {
            setTimeout(() => {
                this.iteration(number)
            }, Game.GAME_FRAME_DELAY/2);
        }
    }
}