import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper';
import 'swiper/css';
import { MQ } from './constants';

gsap.registerPlugin(ScrollTrigger);

export function initVerticalSwiperScroll() {
  const section = document.querySelector('[data-vertical-stack]');
  if (!section) return;

  const pinEl = section.querySelector('[data-vertical-stack-pin]');
  const swiperEl = section.querySelector('[data-vertical-stack-slider]');
  if (!pinEl || !swiperEl) return;

  const mm = gsap.matchMedia();

  mm.add(MQ.desktop, () => {
    const swiper = new Swiper(swiperEl, {
      direction: 'vertical',
      slidesPerView: 'auto',
      speed: 800,
      allowTouchMove: false,
      autoHeight: true,
      spaceBetween: 48,
    });

    const totalSlides = () => swiper.slides.length;

    let stInstance;
    const buildScrollTrigger = () => {
      if (stInstance) stInstance.kill();

      const steps = Math.max(1, totalSlides() - 1);

      stInstance = ScrollTrigger.create({
        id: 'verticalStackedSolutions',
        trigger: pinEl,
        start: 'top top',
        end: () => '+=' + window.innerHeight * steps,
        pin: true,
        pinSpacing: true,
        scrub: true,
        invalidateOnRefresh: true,
        refreshPriority: 2,
        snap: steps > 0 ? 1 / steps : false,
        onUpdate: self => {
          const idx = Math.round(self.progress * steps);
          if (swiper.activeIndex !== idx) swiper.slideTo(idx);
        },
        onRefresh: () => {
          try {
            swiper.update();
            swiper.updateAutoHeight(300);
          } catch (_) {}
        },
      });
    };

    buildScrollTrigger();

    const handleResize = () => {
      buildScrollTrigger();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      stInstance?.kill();
      swiper.destroy(true, true);
    };
  });
}
