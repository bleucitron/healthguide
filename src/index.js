import 'nodelist-foreach-polyfill';

document.addEventListener("DOMContentLoaded", event => {
    document.querySelectorAll(".app").forEach(app => {
        app.addEventListener("click", ev => {
            startApp(ev.currentTarget.id);
        });
    });
});

function startApp(title) {

    console.log(`clicked on ${title}`);
}
