import activation from "./ActivationFunction.js";

const ACTIVATION = activation.SIGMOID;

/**
 * Feedforward neural network
 * @param {*} network array of 2D array of weights
 * @param {*} inputs input array
 */
export const FeedForward = (network, inputs) => {
    let currentValues = inputs;
    for (let i = 0; i < network.length; i++) {
        currentValues = MultiplyMatrices(network[i], currentValues);
    }
}

/**
 * @param {*} weights First array in weights should be biases for each upcoming node
 */
export const MultiplyMatrices = (weights, inputs) => {
    let currentValues = [];
    for (let i = 0; i < weights[0].length; i++) {
        let sum = weights[0][i]; // Bias
        for (let j = 1; j < weights.length; j++) {
            sum += weights[j][i] * inputs[j-1];
        }
        currentValues.push(ACTIVATION(sum));
    }
    return currentValues;
}