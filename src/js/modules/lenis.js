// js/modules/lenis.js

// DOC: https://lenis.studiofreight.com/

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

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
}

export { initLenisInstances };
