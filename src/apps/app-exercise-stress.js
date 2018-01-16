import router from '../libs/router';
import {showStepUntil, showStepOnly, setDisplayed} from '../libs/dom-tools';

const stepCount = 5;
const stepTimeout = 1 * 1000; // in ms

let timeoutHandler;
let currentStep;

function nextStep() {
    currentStep = currentStep + 1;

    if (currentStep < stepCount) {
        showStepUntil(currentStep, stepCount, '.app-instructions', true);
        showStepOnly(currentStep, '.app-illustrations');

        timeoutHandler = setTimeout(nextStep, stepTimeout);
    } else {
        clearTimeout(timeoutHandler);
        setDisplayed('.app-warm-up', false);
        setDisplayed('.app-video', true);

        const video = document.querySelector("video.app-video");
        video.addEventListener('ended', router.gotoHome);
        video.play();
        setTimeout(() => video.classList.remove("transparent"), 500);
    }
}

const app = {
    title: "Réduction du stress",
    content: require('../views/app-exercise-stress.html'),
    setup: function () {
        currentStep = 0;
        timeoutHandler = setTimeout(nextStep, stepTimeout)
    },
    exit: function () {
        if (timeoutHandler) {
            clearTimeout(timeoutHandler);
        }
    }
};

export default app;