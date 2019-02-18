import router from '../libs/router';

const app = {
  title: "Le bien être au travail",
  content: require('../views/home.html'),
  setup: function () {
    console.log('Hello');
  }
};

export default app;
