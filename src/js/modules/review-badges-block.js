import { Autoplay } from 'swiper/modules';
import { initSwiper } from './sliders';
import { CLASSES } from './constants';

export function initReviewBadgesBlock() {
  const block = document.querySelector('.review-badges-block');
  if (!block) return;

  const swiperEl = document.querySelector('#swiperReviewBadge');
  if (!swiperEl) return;

  const swiper = initSwiper('#swiperReviewBadge', {
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

  const isFine = window.matchMedia('(pointer: fine)').matches;

  const activate = () => {
    block.classList.add(CLASSES.ACTIVE);

    if (swiper) {
      if (typeof swiper.slideToLoop === 'function') {
        swiper.slideToLoop(0, 800);
      } else {
        swiper.slideTo(0, 800);
      }
      swiper.autoplay?.stop();
    }
  };

  const deactivate = () => {
    block.classList.remove(CLASSES.ACTIVE);

    swiper?.autoplay?.start();
  };

  if (isFine) {
    block.addEventListener('mouseenter', activate);
    block.addEventListener('mouseleave', deactivate);
  }

  block.addEventListener('focusin', activate);
  block.addEventListener('focusout', e => {
    if (!block.contains(e.relatedTarget)) deactivate();
  });
}
