import 'babel-polyfill'
import 'nodelist-foreach-polyfill';
import router from './libs/router';
import {startNotifications} from "./libs/notifications";

document.addEventListener("DOMContentLoaded", event => {

    // setup home button
    document.querySelectorAll(".home-button")
        .forEach(button => {
            button.addEventListener("click", router.gotoHome);
        });

    startNotifications();

    // start routing
    router.resolve();
});
