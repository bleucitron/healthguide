const genderType = {
  MALE: 'homme',
  FEMALE: 'femme'
};

const sideType = {
  FRONT: 'face',
  BACK: 'dos'
};

const app = {
  id: 'douleur',
  title: 'Localisation de votre douleur',
  content: require('../views/douleur.html'),
  setup: function () {
    const sideButton = document.getElementById('switch-side');
    const genderButton = document.getElementById('switch-gender');

    const silhouette = document.getElementById('img');
    const infos = document.getElementById('infos');

    const paths = [...document.getElementsByTagName('path')];

    let isBack = false;
    let isFemale = true;

    let currentInfo;
    let currentSvg;

    function updateSilhouette() {
      const side = isBack ? sideType.BACK : sideType.FRONT;
      const gender = isFemale ? genderType.FEMALE : genderType.MALE;
      silhouette.src = `../images/douleur/silhouette_${gender}_${side}.png`;
    }

    function switchSide() {
      [...document.getElementsByTagName('svg')].forEach(svg => {
        svg.classList.toggle('hidden');
      });
      isBack = !isBack;
      updateSilhouette();
    }

    function switchGender() {
      isFemale = !isFemale;
      genderButton.classList.toggle('male');
      updateSilhouette();
    }

    function selectPath(e) {
      // const fullId = `${isFemale ? genderType.FEMALE : genderType.MALE}-${e.currentTarget.id}`;
      const svg = e.target
      const id = svg.classList[0];
      const toShow = document.getElementById(`info-${id}`);

      if (toShow) {
        if (currentInfo) currentInfo.classList.add('hidden');
        if (currentSvg) currentSvg.classList.remove('displayed');

        svg.classList.add('displayed');
        toShow.classList.remove('hidden');
        infos.classList.remove('hidden');

        currentInfo = toShow;
        currentSvg = svg;
      }
    }

    sideButton.addEventListener('click', switchSide);
    genderButton.addEventListener('click', switchGender);
    paths.forEach(path => path.addEventListener('click', selectPath));
  }
};

export default app;
