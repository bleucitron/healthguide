import {
    showStepTextUntil,
    setDisplayed,
    fadeAllStepTexts,
    showStepText,
    showStepIconOnly,
    showStepImageOnly,
    showElement
} from '../libs/dom-tools';
import {warmUp, cancelWait, wait} from "../libs/app-helpers";
import co from 'co';

const breathStepCount = 3;
const breathStepTimeout = 5 * 1000; // in ms

function* loopOneCycle() {
    showStepIconOnly('inspiration', '.app-page-1');
    showStepImageOnly('inspiration', '.app-page-1');
    yield wait(breathStepTimeout);

    showStepIconOnly('expiration', '.app-page-1');
    showStepImageOnly('expiration', '.app-page-1');
    yield wait(breathStepTimeout);
}

function* exercise() {
    yield* warmUp();

    setDisplayed('.app-page-warm-up', false);
    setDisplayed('.app-page-1', true);
    yield wait(breathStepTimeout);

    for (let step = 1; step < breathStepCount; step++) {
        showStepTextUntil(step, breathStepCount, '.app-page-1 .app-instructions');
        showStepImageOnly(step, '.app-page-1');
        showStepIconOnly(step, '.app-page-1');
        yield wait(breathStepTimeout);
    }

    fadeAllStepTexts('.app-page-1 .app-instructions');
    showStepText('loop', '.app-page-1 .app-instructions');

    // loop once
    yield* loopOneCycle();

    // loop advices
    showElement(document.querySelector(".app-advices"));

    while (true) {
        // inspiration
        setDisplayed('.app-advices .step-text', false);
        setDisplayed('.app-advices .step-inspiration', true);

        showStepIconOnly('inspiration', '.app-page-1');
        showStepImageOnly('inspiration-advice', '.app-page-1');
        yield wait(breathStepTimeout);

        // expiration
        setDisplayed('.app-advices .step-text', false);
        setDisplayed('.app-advices .step-expiration', true);

        showStepIconOnly('expiration', '.app-page-1');
        showStepImageOnly('expiration-advice', '.app-page-1');
        yield wait(breathStepTimeout);

        // respiration
        setDisplayed('.app-advices .step-text', false);
        setDisplayed('.app-advices .step-respiration', true);
        // loop one respiration cycle
        yield* loopOneCycle();
    }
}

const app = {
    title: "Apprentissage de la bonne respiration",
    content: require('../views/app-guide-breath.html'),
    setup: function () {
        co(exercise());
    },
    exit: function () {
        cancelWait();
    }
};

export default app;