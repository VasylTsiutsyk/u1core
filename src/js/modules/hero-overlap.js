// hero-overlap.js
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { MQ } from './constants';

gsap.registerPlugin(ScrollTrigger);

export function initHeroOverlap({
  pinRatio = 1.2, // 1.2 = 120% висоти вʼюпорта
  scrub = 0.6,
} = {}) {
  const hero = document.querySelector('.home-hero');
  if (!hero) return;

  const img = hero.querySelector('.home-hero__img');
  const title = hero.querySelector('.home-hero__title');
  const desc = hero.querySelector('.home-hero__description');
  const cta = hero.querySelector('.home-hero__footer');

  const mm = gsap.matchMedia();

  // ===== Desktop (з pin)
  mm.add(MQ.desktop, () => {
    const pinST = ScrollTrigger.create({
      trigger: hero,
      start: '-15% 0%',
      end: () => `+=${pinRatio * 100}%`,
      pin: img,
      pinSpacing: false,
      invalidateOnRefresh: true,
      markers: false,
    });

    gsap.to([title, desc, cta], {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: () => `+=${pinRatio * 100}%`,
        scrub,
        invalidateOnRefresh: true,
      },
    });

    gsap.from([title, desc, cta], {
      autoAlpha: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: hero,
        start: 'top 75%',
      },
    });

    return () => {
      pinST && pinST.kill();
      ScrollTrigger.getAll().forEach(t => t.trigger === hero && t.kill());
    };
  });

  // ===== Mobile/Tablet (без pin)
  mm.add(MQ.touch, () => {
    gsap.from([title, desc, cta], {
      autoAlpha: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: hero,
        start: 'top 85%',
      },
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), {
    once: true,
  });

  window.addEventListener('resize', () => ScrollTrigger.refresh());
}
