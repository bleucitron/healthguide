import router from '../libs/router';
import {setDisplayed} from '../libs/dom-tools';
import {warmUp, cancelWait} from "../libs/app-helpers";
import co from 'co';

function* exercise() {
    yield* warmUp();

    setDisplayed('.app-page-warm-up', false);
    setDisplayed('.app-video', true);

    const video = document.querySelector("video.app-video");
    video.addEventListener('ended', router.gotoAssise);

    video.play();
    setTimeout(() => video.classList.remove("transparent"), 100);
}

const app = {
    title: "Réduction du stress",
    content: require('../views/app-exercise-stress.html'),
    setup: function () {
        co(exercise());
    },
    exit: function () {
        cancelWait();
    }
};

export default app;
