importScripts('./workers-tetris.js')
importScripts('./workers-neat.js')

let tetris = new AITetris(false, true)
let creature;

const run = () => {
    while (tetris.result === undefined) {
        step();
    }
    const result = tetris.result;
    postMessage({result, level: tetris.game.level});
}

const step = () => {
    creature.setInputs(tetris.getInputs());
    creature.feedForward();
    const decision = creature.decision();
    tetris.doAction(decision);
    tetris.step();
}

addEventListener('message', (e) => {
    const model = e.data.model;
    const genes = e.data.genes;
    if (creature === undefined) {
        creature = Creature.BuildFromFlattened(model, genes);
    } else {
        creature.setFlattenedGenes(genes);
    }
    // console.log(creature.network.layers
    //     .flatMap(l => l.nodes.flatMap(n => n.weights.length)).reduce((a,b) => a+b));
    tetris.setup();
    run();
})
