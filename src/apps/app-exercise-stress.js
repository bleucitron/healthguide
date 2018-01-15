import router from '../libs/router';

const app = {
    title: "Réduction du stress",
    content: require('../views/app-exercise-stress.html'),
    setup: function(){
        document.querySelector("video.app-video")
            .addEventListener('ended', router.gotoHome);
    }
};

export default app;