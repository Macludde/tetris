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

export default Node;