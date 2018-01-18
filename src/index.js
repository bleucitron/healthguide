import 'babel-polyfill'
import 'nodelist-foreach-polyfill';
import router from './libs/router';

document.addEventListener("DOMContentLoaded", event => {

    // setup home button
    document.querySelectorAll(".home-button")
        .forEach(button => {
            button.addEventListener("click", router.gotoHome);
        });

    // start routing
    router.resolve();
});
