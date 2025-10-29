// showreel-scale.js

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { MQ } from './constants';

gsap.registerPlugin(ScrollTrigger);

export function initShowreelScale({
  startScaleDesktop = 1.5,
  start = 'top top',
  holdRatio = 0.25,
  animRatio = 1,
  pin = true,
  scrub = 0.6,
} = {}) {
  const section = document.querySelector('.section-showreel');
  if (!section) return;

  const target = section.querySelector('.section-showreel__video');
  if (!target) return;

  // reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(target, { clearProps: 'transform, will-change' });
    return;
  }

  const mm = gsap.matchMedia();

  mm.add(MQ.desktop, () => {
    const totalPercent = (holdRatio + animRatio) * 100;

    gsap.set(target, {
      scale: startScaleDesktop,
      transformOrigin: 'center center',
      willChange: 'transform',
    });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start,
        end: `+=${totalPercent}%`,
        pin,
        scrub,
        invalidateOnRefresh: true,
      },
    });

    tl.to({}, { duration: holdRatio });
    tl.to(target, { scale: 1, duration: animRatio });

    return () => gsap.set(target, { clearProps: 'transform, will-change' });
  });

  const debouncedRefresh = (() => {
    let t;
    return () => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
  })();

  window.addEventListener('load', debouncedRefresh, { once: true });
  window.addEventListener('resize', debouncedRefresh);
  window.addEventListener('orientationchange', debouncedRefresh);
}
