import escape from 'escape-html';

import { createAdvices } from '../libs/dom-tools.js';

import messages from '../data/home.json';

const delay = 10000; // 10s

const app = {
  id: 'home',
  title: 'Le bien être au travail',
  content: require('../views/home.html'),
  setup: () => {

    // Handling Advices
    const carousel = document.getElementById('carousel-content');
    const rightArrow = document.getElementById('carousel-right');
    const leftArrow = document.getElementById('carousel-left');

    let isMoving = false;

    messages.unshift(messages.pop());
    let tilesUl = createAdvices(messages);

    carousel.appendChild(tilesUl);

    let interval = window.setInterval(displayNextAdvice, delay);

    function displayPreviousAdvice() {
      isMoving = !isMoving;
      tilesUl.style = 'transform: translateX(0vw)';

      messages.unshift(messages.pop());
      let newUl = createAdvices(messages);

      tilesUl.addEventListener('transitionend', () => {
        tilesUl.replaceWith(newUl);
        tilesUl = newUl;

        isMoving = !isMoving;

        if (!interval)
          interval = window.setInterval(displayNextAdvice, delay);
      });
    }

    function displayNextAdvice() {
      isMoving = !isMoving;
      tilesUl.style = 'transform: translateX(-200vw)';

      messages.push(messages.shift());

      let newUl = createAdvices(messages);

      tilesUl.addEventListener('transitionend', () => {
        tilesUl.replaceWith(newUl);
        tilesUl = newUl;

        isMoving = !isMoving;

        if (!interval)
          interval = window.setInterval(displayNextAdvice, delay);
      });
    }

    rightArrow.addEventListener('click', () => {
      if (isMoving) return;

      window.clearInterval(interval);
      interval = null;
      displayNextAdvice();
    });
    leftArrow.addEventListener('click', () => {
      if (isMoving) return;

      window.clearInterval(interval);
      interval = null;
      displayPreviousAdvice();
    });

    // Removing form-info
    const inputs = Array.from(document.getElementsByTagName('input'));
    const textarea = document.getElementById('message');

    [...inputs, textarea].forEach(input => {
      input.addEventListener('focus', () => {
        const info = document.getElementsByClassName('form-info visible')[0];
        if (info)
          info.classList.remove('visible');
      });
    });

    // Handling contact form
    document.getElementById('submit').addEventListener('click', () => {
      const form = document.getElementById('form');
      const inputs = Array.from(form.children);

      const isValid = inputs.reduce((isValid, input) => isValid && input.validity.valid, true);

      if (!isValid) {
        document.getElementById('form-invalid').classList.add('visible');
        return;
      }

      const values = inputs.map(input => escape(input.value));
      const [email, name, company, position, phone, message] = values;

      const formattedMsg = `Nom: ${name}
Société: ${company}
Poste: ${position}
Email: ${email}
Téléphone: ${phone}

${message}`;

      fetch('http://www.naturalpad.fr/', {
        method: 'POST',
        body: JSON.stringify({
          'et_pb_contact_name_1': name,
          'et_pb_contact_email_1': email,
          'et_pb_contact_message_1': formattedMsg
        })
      })
      .then(() => document.getElementById('form-sent').classList.add('visible'))
      .catch(e => {
        console.log('e', e);
        document.getElementById('form-error').classList.add('visible')
      });
    });
  }
};

export default app;
