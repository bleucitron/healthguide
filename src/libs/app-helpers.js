import {setDisplayed, showStepImageOnly, showStepTextUntil} from "./dom-tools";

const warmUpStepCount = 5;
const warmUpStepTimeout = 2 * 1000; // in ms

let timeoutHandler;

function wait(millis) {
    return new Promise(resolve => timeoutHandler = setTimeout(resolve, millis));
}

function* warmUp() {
    setDisplayed('.app-page-warm-up', true);
    yield wait(warmUpStepTimeout);
    for (let step = 1; step < warmUpStepCount ; step++) {
        showStepTextUntil(step, warmUpStepCount , '.app-page-warm-up');
        showStepImageOnly(step, '.app-page-warm-up');
        yield wait(warmUpStepTimeout);
    }
}

function cancelWait() {
    if (timeoutHandler) {
        clearTimeout(timeoutHandler);
    }
}

export {wait, warmUp, cancelWait};