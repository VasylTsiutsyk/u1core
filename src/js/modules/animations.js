// js/modules/animations.js

import animateValue from './animate-value';

// ==================== ANIMATIONS ==================== //
// AOS: https://michalsnik.github.io/aos/
// GSAP: https://gsap.com/

import AOS from 'aos';
import 'aos/dist/aos.css';

// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger.js';

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

// GSAP
// -----------------------------------------------------------------------------
// function initGSAPAnimations() {
// gsap.registerPlugin(ScrollTrigger);
// const tl = gsap.timeline({
//   scrollTrigger: {
//     trigger: '.box',
//     start: 'top 60%',
//     end: 'bottom 20%',
//     scrub: true,
//     markers: true,
//   },
// });
// tl.to('.box', { x: 100, opacity: 1, duration: 2 });
// }

export { initAosAnimations };
