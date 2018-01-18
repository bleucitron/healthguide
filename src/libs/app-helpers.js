import {setDisplayed, showStepOnly, showStepUntil} from "./dom-tools";

const warmUpStepCount = 5;
const warmUpStepTimeout = 1.5 * 1000; // in ms

let timeoutHandler;

function wait(millis) {
    return new Promise(resolve => timeoutHandler = setTimeout(resolve, millis));
}

function* warmUp() {
    setDisplayed('.app-warm-up', true);
    yield wait(warmUpStepTimeout);
    for (let step = 1; step < warmUpStepCount ; step++) {
        showStepUntil(step, warmUpStepCount , '.app-warm-up .app-instructions', true);
        showStepOnly(step, '.app-warm-up .app-illustrations');
        yield wait(warmUpStepTimeout);
    }
}

function cancelWait() {
    if (timeoutHandler) {
        clearTimeout(timeoutHandler);
    }
}

export {wait, warmUp, cancelWait};