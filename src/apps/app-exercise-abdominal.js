import {
    showStepTextUntil,
    setDisplayed,
    fadeAllStepTexts,
    showStepText,
    showStepIconOnly,
    showStepImageOnly,
    showElement, hideElement
} from '../libs/dom-tools';
import {warmUp, cancelWait, wait} from '../libs/app-helpers';
import co from 'co';

const stepCount = 3;
const adviceStepCount = 5;
const stepTimeout = 5 * 1000; // in ms

function* exercise() {
    yield* warmUp();

    setDisplayed('.app-page-warm-up', false);
    setDisplayed('.app-page-1', true);
    yield wait(stepTimeout);

    for (let step = 1; step < stepCount; step++) {
        showStepTextUntil(step, stepCount, '.app-page-1 .app-instructions');
        showStepImageOnly(step, '.app-page-1');
        showStepIconOnly(step, '.app-page-1');
        yield wait(stepTimeout);
    }

    // loop advices
    while (true) {
        for (let step = 1; step <= adviceStepCount; step++) { // '<=' because advices start at 1
            // expiration
            fadeAllStepTexts('.app-page-1 .app-instructions');
            showElement(document.querySelector('.app-advices'));

            setDisplayed('.app-advices .step-text', false);
            setDisplayed(`.app-advices .step-expiration-advice-${step}`, true);

            showStepIconOnly('expiration', '.app-page-1');
            showStepImageOnly(`expiration-advice-${step}`, '.app-page-1');
            yield wait(stepTimeout);

            // inspiration
            hideElement(document.querySelector('.app-advices'));

            showStepIconOnly('inspiration', '.app-page-1');
            showStepImageOnly('inspiration', '.app-page-1');
            showStepText('inspiration', '.app-page-1');
            yield wait(stepTimeout);
        }
    }
}

const app = {
    id: 'exercise-abdominal',
    title: 'Gainage / renforcement musculaire',
    content: require('../views/app-exercise-abdominal.html'),
    setup: function () {
        co(exercise());
    },
    exit: function () {
        cancelWait();
    }
};

export default app;
