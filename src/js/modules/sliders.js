// js/modules/sliders.js

import Swiper from 'swiper';
import { Autoplay, EffectCards, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

export function initSwiper(selector, config) {
  const el = document.querySelector(selector);
  if (!el) return;

  return new Swiper(el, config);
}

// Swiper Header Banner
function initSliders() {
  initSwiper('#swiperHeaderBanner', {
    modules: [Autoplay],
    direction: 'vertical',
    speed: 1000,
    slidesPerView: 'auto',
    spaceBetween: 28,
    loop: true,
    autoHeight: true,
    autoplay: {
      delay: 3000,
    },
  });

  // Swiper Team
  // --------------------------------------------------------------------
  initSwiper('#swiperTeam', {
    modules: [Autoplay],
    direction: 'horizontal',
    speed: 6000,
    slidesPerView: 1.75,
    spaceBetween: 28,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 1,
    },
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
  const sliderCaseSpotlight = initSwiper('#swiperCaseSpotlight', {
    modules: [Navigation, Pagination],
    direction: 'horizontal',
    speed: 800,
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    centeredSlides: true,
    navigation: {
      prevEl: '#swiperCaseSpotlightPrev',
      nextEl: '#swiperCaseSpotlightNext',
    },
    pagination: {
      el: '#swiperCaseSpotlightPagination',
      clickable: true,
    },
    breakpoints: {
      992: {
        slidesPerView: 'auto',
      },
    },
  });

  if (window.matchMedia('(min-width: 992px) and (pointer: fine)').matches) {
    bindSwiperDirection(
      sliderCaseSpotlight,
      document.querySelector('.section-cs')
    );
  }

  // Case Partners
  initSwiper('#swiperPartners', {
    modules: [Navigation, Pagination, Autoplay],
    direction: 'horizontal',
    speed: 6000,
    slidesPerView: 'auto',
    spaceBetween: 60,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 1,
    },
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

  // Effectiveness
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

  // Flow
  initSwiper('#swiperFlow', {
    direction: 'horizontal',
    speed: 800,
    slidesPerView: 'auto',
    spaceBetween: 0,
  });

  // Stacked Cards
  initSwiper('#swiperStackedCards', {
    modules: [Autoplay, EffectCards],
    direction: 'horizontal',
    speed: 800,
    effect: 'cards',
    loop: true,
    grabCursor: true,
    cardsEffect: {
      perSlideOffset: 16,
      perSlideRotate: 0,
      slideShadows: false,
      rotate: false,
    },
    autoplay: {
      delay: 3000,
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
    el.textContent = String(val);
    if (p < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function getChartBars(chart) {
  return chart.querySelectorAll('[data-chart-bar]');
}

function getChartMaxValue(chart) {
  let max = 0;

  getChartBars(chart).forEach(bar => {
    const value = parseFloat(bar.dataset.chartValue || '0');
    if (value > max) max = value;
  });

  return max || 1;
}

function resetChart(chart) {
  getChartBars(chart).forEach(bar => {
    bar.style.height = '0%';
  });

  chart
    .querySelectorAll('[data-chart-value-label]')
    .forEach(lbl => (lbl.textContent = '0'));
}

function playChart(chart) {
  const bars = getChartBars(chart);
  const maxValue = getChartMaxValue(chart);

  bars.forEach(bar => {
    const value = parseFloat(bar.dataset.chartValue || '0');
    const heightPercent = (value / maxValue) * 100;

    bar.style.height = '0%';

    requestAnimationFrame(() => {
      bar.style.height = heightPercent + '%';
    });

    const label = bar.querySelector('[data-chart-value-label]');
    if (label) animateNumber(label, value, 900);
  });
}

function bindSwiperDirection(
  swiper,
  sectionEl,
  {
    attr = 'data-swiper-dir',
    nextClass = 'is-next',
    prevClass = 'is-prev',
  } = {}
) {
  if (!swiper || !sectionEl) return;

  const setDir = dir => {
    sectionEl?.setAttribute(attr, dir);
    sectionEl?.classList.toggle(nextClass, dir === 'next');
    sectionEl?.classList.toggle(prevClass, dir === 'prev');
  };

  swiper.on('slideNextTransitionStart', () => setDir('next'));
  swiper.on('slidePrevTransitionStart', () => setDir('prev'));

  swiper.on('sliderMove', () => {
    const diff = swiper.touches?.diff || 0;
    if (diff === 0) return;
    setDir(diff < 0 ? 'next' : 'prev');
  });

  swiper.on('afterInit', () => setDir('next'));
}
