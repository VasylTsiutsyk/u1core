// js/modules/animations.js

import animateValue from './animate-value';
import { initServices } from './services';
import { initShowreelScale } from './showreel-scale';
import { initHeroOverlap } from './hero-overlap';

// ==================== ANIMATIONS ==================== //
// AOS: https://michalsnik.github.io/aos/
// GSAP: https://gsap.com/

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

// GSAP
// -----------------------------------------------------------------------------
function initGSAPAnimations() {
  // Hero Overlap
  initHeroOverlap();

  // Showreel
  initShowreelScale();

  // Services
  initServices();
}

export { initAosAnimations, initGSAPAnimations };
