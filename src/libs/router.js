import Navigo from 'navigo';
import {showHomeButtons, hideHomeButtons, setPage} from './dom-tools';
import appsTemplates from '../apps';

const router = new Navigo(null, true);

router.gotoApp = function(name) {
    router.navigate(router.generate('app', {name: name}));
};

router.gotoHome = function() {
    router.navigate();
};

function startApp(app) {
    setPage(app.title, app.content);
    if ('setup' in app) {
        app.setup();
    }
}

router
    .on(() => {
        startApp(appsTemplates.home);
    }, {
        after: hideHomeButtons
    })
    .on('app/:name', {
        as: 'app',
        uses: function (params) {
            if ('name' in params && params.name !== 'home' && params.name in appsTemplates) {
                startApp(appsTemplates[params.name]);
            } else {
                router.gotoHome();
            }
        }
    }, {
        after: showHomeButtons
    })
    .notFound(router.gotoHome);

export default router;