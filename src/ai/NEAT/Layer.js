import Node from './Node.js';
import activation from './ActivationFunction.js';

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

export default Layer;