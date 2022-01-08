import Network from './Network.js';

function Creature(model) {
	this.network = new Network(model); // Init the network

	this.fitness = 0;
	this.score = 0;

	this.flattenGenes = function () { // Flattens the genes of the creature's genes and returns them as an array.
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

		return genes;
	}

	this.setFlattenedGenes = function (genes) { // Sets an array of weights as the creature's genes.
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

	this.feedForward = function () { // Feeds forward the creature's network.
		this.network.feedForward();
	}

	this.getWeights = function() {
		return this.network.getWeights();
	}

	this.setInputs = function (inputs) { // Sets the inputs of the creature.
		this.network.layers[0].setValues(inputs);
	}

	this.decision = function () { 
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