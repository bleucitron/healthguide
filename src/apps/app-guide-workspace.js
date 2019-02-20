import {showStepTextUntil, showStepImageOnly, hideAllStepTexts} from '../libs/dom-tools';

const stepCount = 6;

let currentPhase;

function* instructions() {
    while (true) {
        for (let step = 1; step < stepCount; step++) {
            showStepTextUntil(step, stepCount);
            showStepImageOnly(step);
            yield;
        }

        hideAllStepTexts();
        showStepImageOnly(0);
        yield;
    }
}

function nextStep(){
    currentPhase.next();
}

const app = {
    id: 'guide-workspace',
    title: 'Adapter son espace de travail',
    content: require('../views/app-guide-workspace.html'),
    setup: function () {
        currentPhase = instructions();
        document.getElementById('app-guide-workspace').addEventListener('click', nextStep);
        document.addEventListener('keypress', nextStep);
    },
    exit: function () {
        document.removeEventListener('keypress', nextStep);
        currentPhase = null;
    }
};

export default app;
