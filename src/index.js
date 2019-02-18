import 'babel-polyfill'
import 'nodelist-foreach-polyfill';
import router from './libs/router';
import {initializeNotifications} from "./libs/notifications";

document.addEventListener("DOMContentLoaded", event => {
    // setup home button
    document.querySelectorAll(".back-button")
        .forEach(button => {
            button.addEventListener("click", router.gotoHome);
        });

    initializeNotifications();

    // start routing
    router.resolve();

    // fixes first navigation not properly handled in latest firefox when page is encrypted with staticrypt
    router.navigate(window.location.href.split('#').pop() || "");
});
