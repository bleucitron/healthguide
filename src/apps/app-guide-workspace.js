const stepCount = 6;
let currentStep;

function showAll() {
    document.querySelectorAll('.app-instructions li').forEach(li => li.classList.remove("faded", "transparent"));
    document.querySelectorAll('.app-illustrations img').forEach(li => li.classList.add("transparent"));
    document.querySelectorAll('img.step-0').forEach(li => li.classList.remove("transparent"));
}

function showStep(step) {
    if (step === 0) {
        showAll();
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
        // images are transparents
        document.querySelectorAll(`img.step-${i}`).forEach(img => img.classList.add("transparent"));
        i += 1;
    }
    // current step
    document.querySelectorAll(`li.step-${step}`).forEach(li => li.classList.remove("faded", "transparent"));
    document.querySelectorAll(`img.step-${step}`).forEach(elem => elem.classList.remove("transparent"));
    i += 1;
    while (i < stepCount) {
        // list items are transparent
        document.querySelectorAll(`li.step-${i}`).forEach(li => {
            li.classList.remove("faded");
            li.classList.add("transparent");
        });
        // images are transparents
        document.querySelectorAll(`img.step-${i}`).forEach(img => img.classList.add("transparent"));
        i += 1;
    }
}

function nextStep(){
    currentStep = (currentStep + 1) % stepCount;
    showStep(currentStep);
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