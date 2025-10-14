// js/modules/lenis.js

// DOC: https://lenis.studiofreight.com/

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';

function initLenisInstances() {
  const lenis = new Lenis();

  // lenis.on('scroll', e => {
  //   console.log(e);
  // });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // =============== GSAP ScrollTrigger ===============
  // lenis.on('scroll', ScrollTrigger.update);

  // gsap.ticker.add(time => {
  //   lenis.raf(time * 1000);
  // });

  // gsap.ticker.lagSmoothing(0);
}

export { initLenisInstances };
