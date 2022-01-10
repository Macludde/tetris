importScripts('./workers-tetris.js')
importScripts('./workers-neat.js')

let tetris;
let creatures;

const run = () => {
    for (let i = 0; i < creatures.length; i++) {
        while (tetris[i].result === undefined) {
            step(i);
        }
        const result = tetris[i].result;
        postMessage({result, level: tetris[i].game.level, index: i});
    }
}

const step = (i) => {
    creatures[i].setInputs(tetris[i].getInputs());
    creatures[i].feedForward();
    const decision = creatures[i].decision();
    tetris[i].doAction(decision);
    tetris[i].step();
}

addEventListener('message', (e) => {
    const model = e.data.model;
    const genes = e.data.genes;
    if (creatures === undefined) {
        creatures = [];
        tetris = [];
        for (let i = 0; i < genes.length; i++) {
            tetris.push(new AITetris(false, true));
            creatures.push(Creature.BuildFromFlattened(model, genes[i]));
        }
    } else {
        for (let i = 0; i < creatures.length; i++) {
            creatures[i].setFlattenedGenes(genes[i]);
        }
    }
    // console.log(creature.network.layers
    //     .flatMap(l => l.nodes.flatMap(n => n.weights.length)).reduce((a,b) => a+b));
    for (let i = 0; i < creatures.length; i++) {
        tetris[i].setup();
    }
    run();
})
