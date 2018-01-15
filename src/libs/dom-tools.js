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

export {showHomeButtons, hideHomeButtons, setPage};
