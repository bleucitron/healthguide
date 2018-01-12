import 'nodelist-foreach-polyfill';

const homeTemplate = require('./views/home.html');

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

document.addEventListener("DOMContentLoaded", event => {
    const container = document.getElementById("main-container");

    function setContent(content) {
        container.innerHTML = content;
    }

    function startApp(title) {
        setContent(`<div>The app ${title}</div>`);
        showHomeButtons();
    }

    function gotoHome() {
        setContent(homeTemplate);
        hideHomeButtons();

        // setup apps listeners
        document.querySelectorAll(".app").forEach(app => {
            app.addEventListener("click", ev => {
                startApp(ev.currentTarget.id);
            });
        });
    }

    // setup home button
    document.querySelectorAll(".home-button")
        .forEach(button => {
            button.addEventListener("click", gotoHome);
        });

    gotoHome();
});
