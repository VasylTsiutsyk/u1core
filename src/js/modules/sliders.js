// js/modules/sliders.js

// ===== SLIDER ===== //
// DOC: https://swiperjs.com/
// HTML: s-swip
// npm i swiper

import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

  // Swiper Youtube Videos
  // --------------------------------------------------------------------
  initSwiper('#swiperYoutubeVideos', {
    modules: [Navigation, Pagination],
    direction: 'horizontal',
    speed: 800,
    slidesPerView: 1,
    spaceBetween: 28,
    navigation: {
      prevEl: '#swiperYoutubeVideosPrev',
      nextEl: '#swiperYoutubeVideosNext',
    },
    pagination: {
      el: '#swiperYoutubeVideosPagination',
      clickable: true,
    },
    breakpoints: {
      992: {
        slidesPerView: 2,
        spaceBetween: 28,
      },
    },
  });

  // Swiper Social Proofs
  initSwiper('#swiperSocProof', {
    modules: [Navigation, Pagination],
    direction: 'horizontal',
    speed: 800,
    slidesPerView: 1,
    spaceBetween: 28,
    navigation: {
      prevEl: '#swiperSocProofPrev',
      nextEl: '#swiperSocProofNext',
    },
    pagination: {
      el: '#swiperSocProofPagination',
      clickable: true,
    },
  });

  // Case Spotlight
  initSwiper('#swiperCaseSpotlight', {
    modules: [Navigation, Pagination],
    direction: 'horizontal',
    speed: 800,
    slidesPerView: 'auto',
    spaceBetween: 24,
    navigation: {
      prevEl: '#swiperCaseSpotlightPrev',
      nextEl: '#swiperCaseSpotlightNext',
    },
    pagination: {
      el: '#swiperCaseSpotlightPagination',
      clickable: true,
    },
  });

  // Case Spotlight
  initSwiper('#swiperPartners', {
    modules: [Navigation, Pagination],
    direction: 'horizontal',
    speed: 800,
    slidesPerView: 'auto',
    spaceBetween: 60,
    centeredSlides: true,
    loop: true,
  });

  // Result Facts
  initSwiper('#swiperResultFacts', {
    modules: [Navigation, Pagination],
    direction: 'horizontal',
    speed: 800,
    slidesPerView: 1,
    spaceBetween: 28,
    navigation: {
      prevEl: '#swiperResultFactsPrev',
      nextEl: '#swiperResultFactsNext',
    },
    pagination: {
      el: '#swiperResultFactsPagination',
      clickable: true,
    },
    on: {
      init(sw) {
        const active = sw.slides[sw.activeIndex];
        const chart = active.querySelector('[data-chart]');
        if (chart) playChart(chart);
      },
      slideChangeTransitionStart(sw) {
        sw.slides.forEach(sl => {
          const c = sl.querySelector('[data-chart]');
          if (c) resetChart(c);
        });
      },
      slideChangeTransitionEnd(sw) {
        const active = sw.slides[sw.activeIndex];
        const chart = active.querySelector('[data-chart]');
        if (chart) playChart(chart);
      },
    },
  });

  initSwiper('#swiperEffectiveness', {
    modules: [Navigation, Pagination, Autoplay],
    direction: 'horizontal',
    speed: 800,
    slidesPerView: 'auto',
    spaceBetween: 16,
    autoHeight: true,
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: '#swiperEffectivenessFraction',
      type: 'bullets',
      clickable: true,

      renderBullet: function (index, className) {
        return (
          '<span class="' +
          className +
          '">' +
          (index + 1) +
          '<span></span>' +
          '</span>'
        );
      },
    },
    breakpoints: {
      992: {
        direction: 'vertical',
      },
    },
  });
}

export default initSliders;

function animateNumber(el, to, duration = 800) {
  const from = 0;
  const start = performance.now();

  function frame(t) {
    const p = Math.min(1, (t - start) / duration);
    const val = Math.round(from + (to - from) * p);
    el.textContent = `${val}%`;
    if (p < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function resetChart(chart) {
  chart.querySelectorAll('[data-chart-bar]').forEach(bar => {
    bar.style.height = '0%';
  });

  chart
    .querySelectorAll('[data-chart-label]')
    .forEach(lbl => (lbl.textContent = '0%'));
}

function playChart(chart) {
  const bars = chart.querySelectorAll('[data-chart-bar]');
  bars.forEach(bar => {
    const percent = parseFloat(bar.dataset.percent || '0');
    bar.style.height = '0%';

    requestAnimationFrame(() => {
      bar.style.height = percent + '%';
    });

    const label = bar.querySelector('[data-chart-label]');
    if (label) animateNumber(label, percent, 900);
  });
}
