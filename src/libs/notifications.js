import {setDisplayed} from "./dom-tools";

function requestNotificationsPermission(){
    return new Promise(resolve => {
        if (Notification.permission !== "default") {
            resolve(Notification.permission);
            return;
        }
        Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
            resolve(Notification.permission);
        });
    });
}

function updateNotificationHelpers(status){
    setDisplayed('#ask-notifications-permission', status === 'default');
    setDisplayed('#notifications-denied', status === 'denied');
}

function askForPermission() {
    requestNotificationsPermission()
        .then(updateNotificationHelpers);
}

export function startNotifications(){
    if (!window.Notification) {
        setDisplayed('#notifications-unavailable', true);
        setDisplayed('#ask-notifications-permission', false);
        setDisplayed('#notifications-denied', false);
        return;
    }

    document.getElementById('ask-notifications-permission')
        .addEventListener('click', askForPermission);

    updateNotificationHelpers(Notification.permission);
    setInterval(() => updateNotificationHelpers(Notification.permission), 3000);
}