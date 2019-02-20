import Navigo from 'navigo';
import { showBackButtons, hideBackButtons, setPage } from './dom-tools';
import appsTemplates from '../apps';

function startApp(app) {
  setPage(app);

  if ('setup' in app) {
    app.setup();
  }
}

const router = new Navigo(null, true);

router.gotoAssise = function (name) {
  router.navigate(router.generate('assise', { name: name }));
};

router.gotoHome = function () {
  router.navigate();
};

router
  .on(() => startApp(appsTemplates.home), { after: hideBackButtons })
  .on('contact', () => startApp(appsTemplates.home), { after: hideBackButtons })
  .on('douleur', () => startApp(appsTemplates.douleur), {
    after: () => showBackButtons(router.gotoHome)
  })
  .on('assise', () => startApp(appsTemplates.assise), {
    after: () => showBackButtons(router.gotoHome)
  })
  .on('assise/:name', {
    as: 'assise',
    uses: params => {
      if ('name' in params && params.name !== 'assise' && params.name in appsTemplates) {
        startApp(appsTemplates[params.name]);
      } else {
        router.navigate('assise');
      }
    }
  }, {
      after: () => showBackButtons(router.gotoAssise),
      leave: params => {
        if ('name' in params && params.name in appsTemplates) {
          const app = appsTemplates[params.name];
          if ('exit' in app) {
            app.exit();
          }
        } else {
          console.error("unknown app: " + params.name);
        }
      }
    })
  .notFound(router.gotoHome);

export default router;
