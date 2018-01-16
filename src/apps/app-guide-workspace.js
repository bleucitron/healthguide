import {showStepUntil, showStepOnly, showAllSteps} from '../libs/dom-tools';

const stepCount = 6;
let currentStep;

function nextStep(){
    currentStep = (currentStep + 1) % stepCount;
    if (currentStep === 0) {
        showAllSteps('.app-instructions');
    } else {
        showStepUntil(currentStep, stepCount, '.app-instructions', true);
    }
    showStepOnly(currentStep, '.app-illustrations');
}

const app = {
    title: "Adapter son espace de travail",
    content: require('../views/app-guide-workspace.html'),
    setup: function () {
        currentStep = 0;
        document.getElementById("app-guide-workspace").addEventListener('click', nextStep);
    }
};

export default app;