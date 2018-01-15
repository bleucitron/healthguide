import router from '../libs/router';

const app = {
    title: "Réduction du stress",
    content: require('../views/app-exercise-stress.html'),
    setup: function(){
        const video = document.querySelector("video.app-video");
        video.addEventListener('ended', router.gotoHome);
        video.addEventListener('canplay', () => video.classList.remove("transparent"))
    }
};

export default app;