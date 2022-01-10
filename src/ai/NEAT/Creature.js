import Network from './Network.js';

class Creature {

	static BuildFromFlattened(model, flattenedGenes) {
		const creature = new Creature(model);
		creature.setFlattenedGenes(flattenedGenes);
		return creature;
	}
	constructor(model) {
		this.network = new Network(model); // Init the network

		this.fitness = 0;
		this.score = 0;
	}

	flattenGenes() { // Flattens the genes of the creature's genes and returns them as an array.
		let genes = [];

		for (let i = 0; i < this.network.layers.length - 1; i++) {
			for (let w = 0; w < this.network.layers[i].nodes.length; w++) {
				for (let e = 0; e < this.network.layers[i].nodes[w].weights.length; e++) {
					genes.push(this.network.layers[i].nodes[w].weights[e]);
				}
			}

			for (let w = 0; w < this.network.layers[i].bias.weights.length; w++) {
				genes.push(this.network.layers[i].bias.weights[w]);
			}
		}

		this.flattenedGenes = genes;

		return genes;
	}

	setFlattenedGenes(genes) { // Sets an array of weights as the creature's genes.
		let start = 0;
		for (let i = 0; i < this.network.layers.length - 1; i++) {
			for (let w = 0; w < this.network.layers[i].nodes.length; w++) {
				this.network.layers[i].nodes[w].weights = 
					genes.slice(start, start + this.network.layers[i].nodes[w].weights.length);
			}

			this.network.layers[i].bias.weights = 
				genes.slice(start, start + this.network.layers[i].bias.weights.length)
		}
	}

	feedForward() { // Feeds forward the creature's network.
		this.network.feedForward();
	}

	getWeights() {
		return this.network.getWeights();
	}

	setInputs(inputs) { // Sets the inputs of the creature.
		this.network.layers[0].setValues(inputs);
	}

	decision() { 
		let index = -1; 
		let max = -Infinity;
		for (let i = 0; i < this.network.layers[this.network.layers.length - 1].nodes.length; i++) {
            const value = this.network.layers[this.network.layers.length - 1].nodes[i].value
			if (value > max) {
				max = value;
				index = i;
			}
		}
		return index;
	}
}

export default Creature;