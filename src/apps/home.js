import router from '../libs/router';

const app = {
    title: "Nom de l'application",
    content: require('../views/home.html'),
    setup: function() {
        document.querySelectorAll(".app").forEach(app => {
            app.addEventListener("click", ev => {
                router.gotoApp(ev.currentTarget.id);
            });
        });
    }
};

export default app;