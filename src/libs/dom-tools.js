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

function setContent(content) {
    return document.getElementById("main-container").innerHTML = content;
}

function setTitle(title) {
    return document.getElementById("page-title").innerText = title;
}

export {showHomeButtons, hideHomeButtons, setContent, setTitle};
