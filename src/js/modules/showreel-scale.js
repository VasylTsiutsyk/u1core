// showreel-scale.js

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

export function initShowreelScale({
  startScaleDesktop = 1.5,
  startScaleMobile = 1.25,
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
    gsap.set(target, { clearProps: 'transform' });
    return;
  }

  const mm = gsap.matchMedia();

  const build = initialScale => {
    const totalPercent = (holdRatio + animRatio) * 100;

    gsap.set(target, {
      scale: initialScale,
      transformOrigin: 'center center',
      willChange: 'transform',
    });

    const tl = gsap.timeline({
      defaults: {
        ease: 'none',
      },
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

    tl.to(target, {
      scale: 1,
      duration: animRatio,
    });
  };

  // desktop
  mm.add('(min-width: 992px)', () => build(startScaleDesktop));

  // mobile / tablet
  mm.add('(max-width: 991.98px)', () => build(startScaleMobile));

  window.addEventListener('load', () => ScrollTrigger.refresh(), {
    once: true,
  });
  window.addEventListener('resize', () => ScrollTrigger.refresh());
}
