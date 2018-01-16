import {hideAllSteps, showStepOnly, showStepUntil, setDisplayed} from '../libs/dom-tools';

const instructionStepCount = 9;
const adviceStepCount = 4;

let currentStep;

function instructionPhase(step, count) {
    setDisplayed('.app-instructions', true);
    setDisplayed('.app-advices', false);

    showStepUntil(step, count, '.app-instructions', true);
    showStepOnly(step, '.app-illustrations');
}

function resetPhase(){
    setDisplayed('.app-instructions', true);
    setDisplayed('.app-advices', false);

    hideAllSteps('.app-advices');
    hideAllSteps('.app-instructions');
    showStepOnly(0, '.app-illustrations');
}

function advicePhase(step, count){
    setDisplayed('.app-instructions', false);
    setDisplayed('.app-advices', true);

    showStepUntil(step, count, '.app-advices', true);
    showStepOnly(0, '.app-illustrations');
}

function nextStep(){
    currentStep = (currentStep + 1) % (instructionStepCount + adviceStepCount);

    if (currentStep === 0) {
        resetPhase();
    } else if (currentStep < instructionStepCount) {
        instructionPhase(currentStep, instructionStepCount)
    } else {
        advicePhase(currentStep - instructionStepCount + 1, adviceStepCount);
    }
}

const app = {
    title: "Bonne posture",
    content: require('../views/app-guide-posture.html'),
    setup: function () {
        currentStep = 0;
        document.getElementById("app-guide-posture").addEventListener('click', nextStep);
        document.addEventListener('keypress', nextStep);
    },
    exit: function () {
        document.removeEventListener('keypress', nextStep);
    }
};

export default app;