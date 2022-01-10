import Layer from './Layer.js';

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

export default Network;