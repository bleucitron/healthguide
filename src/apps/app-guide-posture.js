import {hideAllSteps, showStepOnly, showStepUntil, setDisplayed} from '../libs/dom-tools';

const instructionStepCount = 9;
const adviceStepCount = 4;

let currentPhase;

function* instructions() {
    while (true) {
        // instructions
        setDisplayed('.app-instructions', true);
        setDisplayed('.app-advices', false);

        for (let step = 1; step < instructionStepCount; step++) {
            showStepUntil(step, instructionStepCount, '.app-instructions', true);
            showStepOnly(step, '.app-illustrations');
            yield;
        }

        setDisplayed('.app-instructions', false);
        setDisplayed('.app-advices', true);

        // advices
        for (let step = 1; step < adviceStepCount; step++) {
            showStepUntil(step, adviceStepCount, '.app-advices', true);
            showStepOnly(0, '.app-illustrations');
            yield;
        }

        // reset
        setDisplayed('.app-instructions', true);
        setDisplayed('.app-advices', false);

        hideAllSteps('.app-advices');
        hideAllSteps('.app-instructions');
        showStepOnly(0, '.app-illustrations');
        yield;
    }
}

function nextStep() {
    currentPhase.next();
}

const app = {
    title: "Bonne posture",
    content: require('../views/app-guide-posture.html'),
    setup: function () {
        currentPhase = instructions();
        document.getElementById("app-guide-posture").addEventListener('click', nextStep);
        document.addEventListener('keypress', nextStep);
    },
    exit: function () {
        document.removeEventListener('keypress', nextStep);
    }
};

export default app;