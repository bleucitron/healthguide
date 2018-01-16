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

function showStepOnly(step, container) {
    container = container || "";
    document.querySelectorAll(container + ' .step').forEach(elm => elm.classList.add("transparent"));
    document.querySelectorAll(container + ` .step-${step}`).forEach(elm => elm.classList.remove("transparent", "faded"));
}

function showAllSteps(container) {
    container = container || "";
    document.querySelectorAll(container + ' .step').forEach(elm => elm.classList.remove("faded", "transparent"));
}

function showStepUntil(step, stepCount, container, fadeBefore) {
    container = container || "";
    let i = 0;
    // previous steps
    while (i < step) {
        // list items are partially faded
        document.querySelectorAll(container + ` .step-${i}`).forEach(elm => {
            elm.classList.remove("transparent");
            if (fadeBefore) {
                elm.classList.add("faded");
            } else {
                elm.classList.remove("faded");
            }
        });
        i += 1;
    }
    // current step
    document.querySelectorAll(container + ` .step-${step}`).forEach(elm => elm.classList.remove("faded", "transparent"));
    i += 1;
    while (i < stepCount) {
        // list items are transparent
        document.querySelectorAll(`.app-instructions .step-${i}`).forEach(elm => {
            elm.classList.remove("faded");
            elm.classList.add("transparent");
        });
        i += 1;
    }
}

// function showInstructionStep(step, stepCount) {
//     let i = 0;
//     // previous steps
//     while (i < step) {
//         // list items are partially faded
//         document.querySelectorAll(`.app-instructions .step-${i}`).forEach(li => {
//             li.classList.add("faded");
//             li.classList.remove("transparent");
//         });
//         i += 1;
//     }
//     // current step
//     document.querySelectorAll(`.app-instructions .step-${step}`).forEach(li => li.classList.remove("faded", "transparent"));
//     i += 1;
//     while (i < stepCount) {
//         // list items are transparent
//         document.querySelectorAll(`.app-instructions .step-${i}`).forEach(li => {
//             li.classList.remove("faded");
//             li.classList.add("transparent");
//         });
//         i += 1;
//     }
// }

export {showHomeButtons, hideHomeButtons, setPage, showStepOnly, showAllSteps, showStepUntil};
