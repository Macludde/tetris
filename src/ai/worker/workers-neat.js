const activation = {
	RELU: function (x) {
		if (x > 0) return x;
		else return 0;
	},
	TANH: function (x) {
		return Math.tanh(x);
	},
	SIGMOID: function (x) {
		return (1 / (1 + Math.exp(-x)));
	},
	LEAKY_RELU: function (x) {
		if (x > 0) return x;
		else return (x * 0.01);
	},
	SOFTMAX: function (array) {
		let sum = 0;
		let result = [];
		for (let i = 0; i < array.length; i++) {
			sum += Math.exp(array[i]);
		}
		for (let i = 0; i < array.length; i++) {
			result.push(Math.exp(array[i]) / sum);
		}
		return result;
	}
}

class Node { // A Node.
	value = 0;
	weights = [];


	initWeights(count) { // Randomly initalize weights.
		this.weights = new Array(count);
		for (let i = 0; i < count; i++) {
			this.weights[i] = (Math.random() * 2) - 1;
		}
	}
}

class Layer { // A layer component of a network with nodes and bias node.
	nodes = [];
	bias = undefined;

	constructor(nodeCount, type, activationfunc) {
		this.type = type;
		this.activationfunc = activationfunc;

		for (let i = 0; i < nodeCount; i++) { // Inits  nodes.
			this.nodes.push(new Node());
		}
	
		if (this.type !== "output") this.bias = new Node();
	}

	connect(count) { // Connects one layer to another.
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].initWeights(count);
		}

		if (this.bias !== undefined) this.bias.initWeights(count);
	}

	getWeights() { // Returns all weights of the layer as 3d matrix
		return [this.bias.weights, ...this.nodes.map(node => node.weights)]
	}

	feedForward(layer) { // Feeds forward the layers values to the specified layer.
		for (let i = 0; i < this.bias.weights.length; i++) {
			layer.nodes[i].value = 0;
		}

		for (let i = 0; i < this.nodes.length; i++) {
			for (let w = 0; w < this.nodes[i].weights.length; w++) {
				layer.nodes[w].value += this.nodes[i].value * this.nodes[i].weights[w];
			}
		}

		for (let w = 0; w < this.bias.weights.length; w++) {
			layer.nodes[w].value += this.bias.weights[w];
		}

		if (layer.activationfunc.name !== "SOFTMAX") 
            for (let w = 0; w < layer.nodes.length; w++) 
                layer.nodes[w].value = activation[layer.activationfunc](layer.nodes[w].value);
		else layer.setValues(activation[layer.activationfunc](layer.getValues()));
	}

	getValues() { // Returns the values of the nodes in the layer as an array.
		let result = [];
		for (let i = 0; i < this.nodes.length; i++) {
			result.push(this.nodes[i].value);
		}
		return result;
	}

	setValues(values) { // Sets an array as the nodes values.
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].value = values[i];
		}
	}
}

class Network { // Neural Network.
	layers = [];

	constructor(model) {
		for (let i = 0; i < model.length; i++) { // Init all the layers.
			this.layers.push(new Layer(model[i].nodeCount, model[i].type, model[i].activationfunc));
		}
	
		for (let i = 0; i < this.layers.length - 1; i++) { // Connect the layers to each other.
			this.layers[i].connect(this.layers[i + 1].nodes.length);
		}
	}

	feedForward() { // Feeds forward the network.
		for (let i = 0; i < this.layers.length - 1; i++) {
			this.layers[i].feedForward(this.layers[i + 1]);
		}
	}

	getWeights() {
		return this.layers.slice(0,-1).map(layer => layer.getWeights());
	}
}

class Creature {

	static BuildFromFlattened(model, flattenedGenes) {
		let creature = new Creature(model);
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
