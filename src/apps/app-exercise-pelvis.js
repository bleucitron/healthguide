import {
    showStepTextUntil,
    setDisplayed,
    fadeAllStepTexts,
    showStepText,
    showStepIconOnly,
    showStepImageOnly,
    showElement, hideElement
} from '../libs/dom-tools';
import {warmUp, cancelWait, wait} from "../libs/app-helpers";
import co from 'co';

const stepCount = 2;
const stepTimeout = 5 * 1000; // in ms

function* loopOneCycle() {
    showStepIconOnly('inspiration', '.app-page-2');
    showStepImageOnly('inspiration', '.app-page-2');
    fadeAllStepTexts('.app-page-2 .app-instructions');
    showStepText('inspiration', '.app-page-2');
    yield wait(stepTimeout);

    showStepIconOnly('expiration', '.app-page-2');
    showStepImageOnly('expiration', '.app-page-2');
    fadeAllStepTexts('.app-page-2 .app-instructions');
    showStepText('expiration', '.app-page-2');
    yield wait(stepTimeout);
}

function* exercise() {
    yield* warmUp();

    setDisplayed('.app-page-warm-up', false);
    setDisplayed('.app-page-1', true);
    yield wait(stepTimeout);

    setDisplayed('.app-page-1', false);
    setDisplayed('.app-page-2', true);
    yield wait(stepTimeout);

    for (let step = 1; step < stepCount; step++) {
        showStepTextUntil(step, stepCount, '.app-page-2 .app-instructions');
        showStepImageOnly(step, '.app-page-2');
        showStepIconOnly(step, '.app-page-2');
        yield wait(stepTimeout);
    }

    // loop advices
    while (true) {
        fadeAllStepTexts('.app-page-2 .app-instructions');
        showElement(document.querySelector(".app-advices"));

        // inspiration
        setDisplayed('.app-advices .step-text', false);
        setDisplayed('.app-advices .step-inspiration', true);

        showStepIconOnly('inspiration', '.app-page-2');
        showStepImageOnly('inspiration-advice', '.app-page-2');
        yield wait(stepTimeout);

        // respiration
        setDisplayed('.app-advices .step-text', false);
        setDisplayed('.app-advices .step-respiration', true);

        // expiration
        showStepIconOnly('expiration', '.app-page-2');
        showStepImageOnly('expiration', '.app-page-2');
        yield wait(stepTimeout);

        hideElement(document.querySelector(".app-advices"));

        // loop one respiration cycle
        yield* loopOneCycle();
    }
}

const app = {
    title: "Mobilité du bassin",
    content: require('../views/app-exercise-pelvis.html'),
    setup: function () {
        co(exercise());
    },
    exit: function () {
        cancelWait();
    }
};

export default app;