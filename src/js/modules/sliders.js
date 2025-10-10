// js/modules/sliders.js

// ===== SLIDER ===== //
// DOC: https://swiperjs.com/
// HTML: s-swip
// npm i swiper

import Swiper from 'swiper';
// import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

function initSwiper(selector, config) {
  const el = document.querySelector(selector);
  if (!el) return;

  return new Swiper(el, config);
}

function initSliders() {
  // Swiper Team
  // --------------------------------------------------------------------
  initSwiper('#swiperTeam', {
    direction: 'horizontal',
    speed: 800,
    slidesPerView: 1.75,
    spaceBetween: 28,
    centeredSlides: true,
    loop: true,
    breakpoints: {
      560: {
        slidesPerView: 2.75,
      },
      768: {
        slidesPerView: 3.75,
      },
      992: {
        slidesPerView: 4.75,
      },
      1280: {
        slidesPerView: 5.75,
      },
    },
  });
}

export default initSliders;
