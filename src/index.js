import 'nodelist-foreach-polyfill';

import Navigo from 'navigo';

import {showHomeButtons, hideHomeButtons, setContent, setTitle} from './libs/dom-tools';

const router = new Navigo(null, true);

function startApp(name) {
    router.navigate(router.generate('app', {name: name}));
}

function gotoHome() {
    router.navigate();
}

const appsTemplates = {
    home: {
        title: "Nom de l'application",
        content: require('./views/home.html'),
        setup: function() {
            document.querySelectorAll(".app").forEach(app => {
                app.addEventListener("click", ev => {
                    startApp(ev.currentTarget.id);
                });
            });
        }
    },
    'app-exercise-stress': {
        title: "Réduction du stress",
        content: require('./views/app-exercise-stress.html')
    }
};

function setPage(app){
    console.log(app);
    setContent(app.content);
    setTitle(app.title);
    if ('setup' in app) {
        app.setup();
    }
}

document.addEventListener("DOMContentLoaded", event => {

    // setup home button
    document.querySelectorAll(".home-button")
        .forEach(button => {
            button.addEventListener("click", gotoHome);
        });

    router
        .on(() => setPage(appsTemplates.home), {
            after: hideHomeButtons,
            leave: showHomeButtons
        })
        .on('app/:name', {
            as: 'app',
            uses: function (params) {
                if ('name' in params && params.name !== 'home' && params.name in appsTemplates) {
                    setPage(appsTemplates[params.name]);
                } else {
                    router.navigate();
                }
            }
        }, {
            after: showHomeButtons
        })
        .notFound(gotoHome)
        .resolve();
});
