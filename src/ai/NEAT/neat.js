/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

import crossover from './Crossover.js';
import mutate from './Mutate.js';
import Creature from './Creature.js';

class NEAT {
	creatures = [];
	oldCreatures = [];
	exportModel = [];
	generation = 0;

	constructor(config) {
		this.populationSize = config.populationSize || 500;
		this.mutationRate = config.mutationRate || 0.05;
		this.crossoverMethod = config.crossoverMethod || crossover.RANDOM;
		this.mutationMethod = config.mutationMethod || mutate.RANDOM;
		this.model = config.model;

		for (let i = 0; i < this.model.length; i++) { // Sanitize the model.
			let data = Object.assign({}, this.model[i]);
			if (this.model[i].activationfunc) {
				data.activationfunc = data.activationfunc.name;
				this.exportModel.push(data);
			} else {
				this.exportModel.push(data);
			}
		}
	
		for (let i = 0; i < this.populationSize; i++) { // Create the creatures.
			this.creatures.push(new Creature(this.model));
			this.creatures[i].flattenGenes();
		}
	}

	mutate() { // Parses every creature's genes passes them to the mutation function and sets their new (mutated) genes.
		for (let i = 0; i < this.populationSize; i++) {
			this.creatures[i].flattenedGenes = 
				this.mutationMethod(this.creatures[i].flattenedGenes, Math.max(this.mutationRate/(Math.floor(this.generation/200)), 0.01));

			// this.creatures[i].setFlattenedGenes(genes);
		}
	}

	crossover() { // Takes two creature's genes flattens them and passes them to the crossover function.
		for (let i = 0; i < this.populationSize; i++) {
			this.oldCreatures = Object.assign([], this.creatures);
			let parentx = this.pickCreature();
			let parenty = this.pickCreature();
			
			let genes = this.crossoverMethod(parentx.flattenedGenes, parenty.flattenedGenes);

			// this.creatures[i].setFlattenedGenes(genes);
			this.creatures[i].flattenedGenes = genes;
		}
	}

	pickCreature() { // Normalizes every creature's score (fitness) and and returns a creature based on their fitness value.
		let sum = 0;
		for (let i = 0; i < this.oldCreatures.length; i++) {
			sum += Math.pow(this.oldCreatures[i].score, 2);
		}

		for (let i = 0; i < this.oldCreatures.length; i++) {
			this.oldCreatures[i].fitness = Math.pow(this.oldCreatures[i].score, 2) / sum;
		}
		let index = 0;
		let r = Math.random();
		while (r > 0) {
			r -= this.oldCreatures[index].fitness;
			index += 1;
		}
		index -= 1;
		return this.oldCreatures[index];
	}

	setFitness(fitness, index) { // Sets a creature's score. This will then be normalized for actual fitness value.
		this.creatures[index].score = fitness;
	}

	feedForward() { // Feeds forward every creature's network.
		for (let i = 0; i < this.creatures.length; i++) {
			this.creatures[i].feedForward();
		}
	}

	getWeights() {
		return this.creatures.map(creature => creature.getWeights());
	}

	doGen() { // Does 1 fast generation with crossover and mutation.
		this.crossover();
		this.mutate();
		this.generation++;
	}

	bestCreature() { // Returns the index of the best creature from the previous generation.
		let index = 0;
		let max = -Infinity;
		for (let i = 0; i < this.oldCreatures.length; i++) {
			if (this.oldCreatures[i].fitness > max) {
				max = this.oldCreatures[i].fitness;
				index = i;
			}
		}
		return index;
	}

	getDecisions() { // Returns every creature's decision index in an array.
		let result = [];

		for (let i = 0; i < this.creatures.length; i++) {
			result.push(this.creatures[i].decision());
		}
		return result;
	}

	setInputs(array, index) { // Sets the inputs of the creature indexed as "index".
		this.creatures[index].setInputs(array);
	}

	export(index) {
		let data = [];
		data.push(JSON.parse(JSON.stringify(this.exportModel)));
		data.push([]);
		if (index) {
			data[1].push(this.creatures[index].flattenedGenes);
		} else {
			for (let i = 0; i < this.populationSize; i++) {
				data[1].push(this.creatures[i].flattenedGenes);
			}
		}
		return data;
	}

	import(data) {
		if (JSON.stringify(data[0]) === JSON.stringify(this.exportModel)) {
			console.log('Importing ' + data[1].length + ' creature(s)');
			for (let i = 0; i < data[1].length; i++) {
				let newCreature = new Creature(this.model);
				newCreature.setFlattenedGenes(data[1][i]);
				this.creatures.push(newCreature);
				this.populationSize++;
			}
		} else {
			throw "Invalid model!";
		}
	}
}

export default NEAT;