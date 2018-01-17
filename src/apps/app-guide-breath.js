import {showStepUntil, showStepOnly, setDisplayed} from '../libs/dom-tools';

const warmUpStepCount = 5;
const warmUpStepTimeout = 1.5 * 1000; // in ms

const breathStepCount = 3;
const breathStepTimeout = 2 * 1000; // in ms

let timeoutHandler;
let currentStep;

function warmUpStep() {
    currentStep = currentStep + 1;

    if (currentStep < warmUpStepCount) {
        // warmup phase
        showStepUntil(currentStep, warmUpStepCount, '.app-warm-up .app-instructions', true);
        showStepOnly(currentStep, '.app-warm-up .app-illustrations');

        timeoutHandler = setTimeout(warmUpStep, warmUpStepTimeout);
    } else {
        clearTimeout(timeoutHandler);

        setDisplayed('.app-warm-up', false);
        setDisplayed('#breath-guide', true);

        breathGuideStep();
    }
}

function breathGuideStep(){
    const step = currentStep - warmUpStepCount;
    if (step < breathStepCount) {

        showStepUntil(step, breathStepCount, '#breath-guide .app-instructions', true);
        showStepOnly(step, '#breath-guide .app-illustrations');

        currentStep = currentStep + 1;
        timeoutHandler = setTimeout(breathGuideStep, breathStepTimeout);
    } else {
        breathGuideLoop();
    }
}

function breathGuideLoop() {

}

const app = {
    title: "Apprentissage de la bonne respiration",
    content: require('../views/app-guide-breath.html'),
    setup: function () {
        currentStep = warmUpStepCount - 1;
        timeoutHandler = setTimeout(warmUpStep, warmUpStepTimeout)
    },
    exit: function () {
        if (timeoutHandler) {
            clearTimeout(timeoutHandler);
        }
    }
};

export default app;