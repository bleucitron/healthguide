import {updateNotificationHelpers} from "./dom-tools";

const helperUpdateFrequency = 3 * 1000; // ms
const notificationDelay = 0.05 * 60 * 1000; // ms

const notificationTitle = 'Mon assise dynamique';
const notificationIconURL = require('../images/icons/Icon_notification.png');

const notificationsContent = [
    "Pensez à boire régulièrement.",
    "Pensez à adopter une bonne posture.",
    "Pensez régulièrement à vous lever et faire quelques pas.",
    "Vous habitez en appartement ? Privilégiez les escaliers plutôt que l’ascenseur.",
    "Savez-vous qu’il est recommandé d’aller aux toilettes 7 fois par jour ?",
    "Pensez à regarder au loin pour reposer vos yeux.",
    "Pensez à prendre un peu de temps pour respirer.",
];

const specialNotificationContent = [
    "Pensez à réaliser un des exercices."
];

let nextNotificationIsSpecial = true;
let timeoutHandler;
let lastNotificationTime;
let nextNotificationDelay;

function requestNotificationsPermission() {
    return new Promise(resolve => {
        if (Notification.permission !== "default") {
            resolve(Notification.permission);
            return;
        }
        Notification.requestPermission(function (status) {
            if (Notification.permission !== status && !'permission' in Notification) {
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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function showNotification() {
    if (Notification.permission === 'granted') {
        let content;
        if (nextNotificationIsSpecial) {
            content = specialNotificationContent;
        } else {
            content = notificationsContent[getRandomInt(notificationsContent.length)];
        }
        // one notification in two is special
        nextNotificationIsSpecial = !nextNotificationIsSpecial;

        new Notification(notificationTitle, {
            body: content,
            tag: 'healthguideNotification',
            icon: notificationIconURL
        });
    }
    lastNotificationTime = Date.now();
    timeoutHandler = setTimeout(showNotification, notificationDelay);
}

function pauseNotifications() {
    clearTimeout(timeoutHandler);
    nextNotificationDelay = Math.max(0, notificationDelay - (Date.now() - lastNotificationTime));
}

function resumeNotifications() {
    timeoutHandler = setTimeout(showNotification, nextNotificationDelay);
}

function startNotifications() {
    lastNotificationTime = Date.now();
    nextNotificationDelay = notificationDelay;
}

export function initializeNotifications() {
    if (!window.Notification) {
        updateNotificationHelpers('unavailable');
        return;
    }

    // link to manually ask for permission in case the user has canceled the first time
    document.getElementById('ask-notifications-permission')
        .addEventListener('click', askForPermission);

    updateNotificationHelpers(Notification.permission);
    // periodically update notification helper
    setInterval(() => updateNotificationHelpers(Notification.permission), helperUpdateFrequency);

    // initial ask for permission (in case of 'default' permission)
    askForPermission();

    // periodically show notification (if granted) except when user is using app
    window.addEventListener('focus', pauseNotifications);
    window.addEventListener('blur', resumeNotifications);
    startNotifications();
}