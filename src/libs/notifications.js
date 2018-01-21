import {updateNotificationHelpers} from "./dom-tools";

const helperUpdateFrequency = 3 * 1000; // ms

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

function askForPermission() {
    requestNotificationsPermission()
        .then(updateNotificationHelpers);
}

export function startNotifications(){
    if (!window.Notification) {
        updateNotificationHelpers('unavailable');
        return;
    }

    document.getElementById('ask-notifications-permission')
        .addEventListener('click', askForPermission);

    updateNotificationHelpers(Notification.permission);
    setInterval(() => updateNotificationHelpers(Notification.permission), helperUpdateFrequency);
}