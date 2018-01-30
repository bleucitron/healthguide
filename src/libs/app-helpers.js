import {setDisplayed, showStepImageOnly, showStepTextUntil} from "./dom-tools";

const stepCount = 5;
const stepTimeout = 2 * 1000; // in ms
const endTimeout = 1 * 1000; // in ms

let timeoutHandler;

function wait(millis) {
    return new Promise(resolve => timeoutHandler = setTimeout(resolve, millis));
}

function* warmUp() {
    setDisplayed('.app-page-warm-up', true);
    yield wait(stepTimeout);
    for (let step = 1; step < stepCount ; step++) {
        showStepTextUntil(step, stepCount , '.app-page-warm-up');
        showStepImageOnly(step, '.app-page-warm-up');
        yield wait(stepTimeout);
    }
    yield wait(endTimeout);
}

function cancelWait() {
    if (timeoutHandler) {
        clearTimeout(timeoutHandler);
    }
}

export {wait, warmUp, cancelWait};