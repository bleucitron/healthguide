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

function showIllustrationStep(step) {
    document.querySelectorAll('.app-illustrations img').forEach(li => li.classList.add("transparent"));
    document.querySelectorAll(`.app-illustrations img.step-${step}`).forEach(li => li.classList.remove("transparent"));
}

function showStep(step, stepCount) {
    showIllustrationStep(step);

    if (step === 0) {
        document.querySelectorAll('.app-instructions li').forEach(li => li.classList.remove("faded", "transparent"));
        return;
    }

    let i = 0;
    // previous steps
    while (i < step) {
        // list items are partially faded
        document.querySelectorAll(`li.step-${i}`).forEach(li => {
            li.classList.add("faded");
            li.classList.remove("transparent");
        });
        i += 1;
    }
    // current step
    document.querySelectorAll(`li.step-${step}`).forEach(li => li.classList.remove("faded", "transparent"));
    i += 1;
    while (i < stepCount) {
        // list items are transparent
        document.querySelectorAll(`li.step-${i}`).forEach(li => {
            li.classList.remove("faded");
            li.classList.add("transparent");
        });
        i += 1;
    }
}

export {showHomeButtons, hideHomeButtons, setPage, showStep};
