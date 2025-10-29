// js/modules/animations.js

import animateValue from './animate-value';

import AOS from 'aos';
import 'aos/dist/aos.css';

// AOS
// -----------------------------------------------------------------------------
function initAosAnimations() {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true, // запускати анімацію один раз
    mirror: false, // не анімувати назад при прокрутці вверх
    disable: 'mobile', // кращий варіант, ніж просто 'mobile'
  });

  // Додатковий тригер для кастомних функцій при вході елемента
  document.addEventListener('aos:in', ({ detail }) => {
    if (detail.hasAttribute('data-dig-counter')) {
      animateValue(detail, parseFloat(detail.innerText), 600);
    }
  });
}

export { initAosAnimations };
