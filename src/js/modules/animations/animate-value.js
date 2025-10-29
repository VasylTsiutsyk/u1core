// js/modules/animate-value.js

function animateValue(el, end, duration = 1000) {
  const start = 0;
  let startTs = null;

  el.textContent = '0';

  const step = ts => {
    if (startTs === null) startTs = ts;
    const progress = Math.min((ts - startTs) / duration, 1);

    const value = Math.floor(progress * (end - start) + start);
    el.textContent = value;

    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}
export default animateValue;
