import 'babel-polyfill'
import 'nodelist-foreach-polyfill';
import router from './libs/router';
import {initializeNotifications} from "./libs/notifications";

document.addEventListener("DOMContentLoaded", event => {

    // setup home button
    document.querySelectorAll(".home-button")
        .forEach(button => {
            button.addEventListener("click", router.gotoHome);
        });

    initializeNotifications();

    // start routing
    router.resolve();
});
