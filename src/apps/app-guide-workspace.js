import {showStepUntil, showStepOnly, hideAllSteps} from '../libs/dom-tools';

const stepCount = 6;

let currentPhase;

function* instructions(count) {
    while (true) {
        for (let step = 1; step < count; step++) {
            showStepUntil(step, count, '.app-instructions', true);
            showStepOnly(step, '.app-illustrations');
            yield;
        }

        hideAllSteps('.app-instructions');
        showStepOnly(0, '.app-illustrations');
        yield;
    }
}

function nextStep(){
    currentPhase.next();
}

const app = {
    title: "Adapter son espace de travail",
    content: require('../views/app-guide-workspace.html'),
    setup: function () {
        currentPhase = instructions(stepCount);
        document.getElementById("app-guide-workspace").addEventListener('click', nextStep);
        document.addEventListener('keypress', nextStep);
    },
    exit: function () {
        document.removeEventListener('keypress', nextStep);
        currentPhase = null;
    }
};

export default app;