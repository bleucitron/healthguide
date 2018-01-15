import router from '../libs/router';
import appsTemplates from '../apps';

const app = {
    title: "Nom de l'application",
    content: require('../views/home.html'),
    setup: function () {
        document.querySelectorAll(".app").forEach(app => {
            app.addEventListener("click", ev => {
                router.gotoApp(ev.currentTarget.dataset.appId);
            });
        });
        document.querySelectorAll(".app-title h3").forEach(title => {
            if (title.dataset.appId in appsTemplates) {
                const app = appsTemplates[title.dataset.appId];
                title.textContent = app.title;
            }
        });
    }
};

export default app;