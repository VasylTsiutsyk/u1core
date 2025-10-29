// progress-ring.js
export function initProgressRings({
  selector = '[data-progress]',
  duration = 1000, // тривалість анімації (мс)
  ease = t => 1 - Math.pow(1 - t, 3), // easeOutCubic
} = {}) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const animateTo = (el, toVal) => {
    const target = Math.max(0, Math.min(100, Number(toVal) || 0));
    const start = reduce
      ? target
      : Number(el.getAttribute('aria-valuenow')) || 0;
    const startTime = performance.now();

    const tick = now => {
      const t = Math.min(1, (now - startTime) / duration);
      const v = Math.round(start + (target - start) * (reduce ? 1 : ease(t)));

      el.style.setProperty('--pr-p', (v / 100).toString());
      el.setAttribute('aria-valuenow', String(v));

      const label = el.querySelector('.progress-ring__label');
      if (label) label.textContent = `${v}%`;

      if (!reduce && t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        const sz = el.dataset.progressSize;
        const th = el.dataset.progressThickness;
        if (sz) el.style.setProperty('--pr-size', `${parseFloat(sz)}px`);
        if (th) el.style.setProperty('--pr-thickness', `${parseFloat(th)}px`);

        animateTo(el, el.dataset.progressValue);
        io.unobserve(el);
      });
    },
    { threshold: 0.35 }
  );

  els.forEach(el => {
    el.setAttribute('aria-valuenow', '0');
    el.style.setProperty('--pr-p', '0');
    io.observe(el);
  });

  document.addEventListener(
    'progress:update',
    e => {
      const el = e.target.closest(selector);
      if (el) animateTo(el, el.dataset.progressValue);
    },
    true
  );
}
