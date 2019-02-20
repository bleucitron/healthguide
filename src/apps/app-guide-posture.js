import {hideAllStepTexts, showStepImageOnly, showStepTextUntil, setDisplayed} from '../libs/dom-tools';

const instructionStepCount = 9;
const adviceStepCount = 5;

let currentPhase;

function* instructions() {
    while (true) {
        for (let step = 1; step < instructionStepCount; step++) {
            showStepTextUntil(step, instructionStepCount, '.app-page-1');
            showStepImageOnly(step, '.app-page-1');
            yield;
        }

        setDisplayed('.app-page-2', true);
        setDisplayed('.app-page-1', false);

        for (let step = 1; step < adviceStepCount; step++) {
            showStepTextUntil(step, adviceStepCount, '.app-page-2');
            yield;
        }

        // reset
        hideAllStepTexts();
        showStepImageOnly(0);

        setDisplayed('.app-page-1', true);
        setDisplayed('.app-page-2', false);
        yield;
    }
}

function nextStep() {
    currentPhase.next();
}

const app = {
    id: 'guide-posture',
    title: 'Bonne posture',
    content: require('../views/app-guide-posture.html'),
    setup: function () {
        currentPhase = instructions();
        document.getElementById('app-guide-posture').addEventListener('click', nextStep);
        document.addEventListener('keypress', nextStep);
    },
    exit: function () {
        document.removeEventListener('keypress', nextStep);
    }
};

export default app;
