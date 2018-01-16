function showHomeButtons() {
    document.querySelectorAll(".home-button")
        .forEach(button => {
            button.classList.remove("hidden");
        });
}

function hideHomeButtons() {
    document.querySelectorAll(".home-button")
        .forEach(button => {
            button.classList.add("hidden");
        });
}

function setPage(title, content) {
    document.getElementById("page-title").textContent = title;
    document.getElementById("main-container").innerHTML = content;
}

function setDisplayed(query, displayed) {
    document.querySelectorAll(query)
        .forEach(elm => {
            if (displayed) {
                elm.classList.remove('undisplayed');
            } else {
                elm.classList.add('undisplayed');
            }
        });
}

function hideElement(elm) {
    elm.classList.add('transparent');
    elm.classList.remove('faded');
}

function showElement(elm) {
    elm.classList.remove('transparent');
    elm.classList.remove('faded');
}

function fadeElement(elm) {
    elm.classList.remove('transparent');
    elm.classList.add('faded');
}

function showStepOnly(step, container) {
    container = container || "";
    document.querySelectorAll(container + ' .step').forEach(hideElement);
    document.querySelectorAll(container + ` .step-${step}`).forEach(showElement);
}

function showAllSteps(container) {
    container = container || "";
    document.querySelectorAll(container + ' .step').forEach(showElement);
}

function hideAllSteps(container) {
    container = container || "";
    document.querySelectorAll(container + ' .step').forEach(hideElement);
}

function showStepUntil(step, stepCount, container, fadeBefore) {
    container = container || "";
    let i = 0;
    const applyBefore = fadeBefore ? fadeElement : showElement;
    // previous steps
    while (i < step) {
        document.querySelectorAll(container + ` .step-${i}`).forEach(applyBefore);
        i += 1;
    }

    // current step
    document.querySelectorAll(container + ` .step-${step}`).forEach(showElement);
    i += 1;

    // next steps
    while (i < stepCount) {
        document.querySelectorAll(`.app-instructions .step-${i}`).forEach(hideElement);
        i += 1;
    }
}

export {showHomeButtons, hideHomeButtons, setPage, showStepOnly, showAllSteps, showStepUntil, setDisplayed, hideAllSteps};
