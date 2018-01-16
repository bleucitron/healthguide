import {showStep} from '../libs/dom-tools';

const stepCount = 9;
let currentStep;

function nextStep(){
    currentStep = (currentStep + 1) % stepCount;
    showStep(currentStep, stepCount);
}

const app = {
    title: "Bonne posture",
    content: require('../views/app-guide-posture.html'),
    setup: function () {
        currentStep = 0;
        document.getElementById("app-guide-posture").addEventListener('click', nextStep);
    }
};

export default app;