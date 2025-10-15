// spotlight-follow.js
export function initSpotlightFollow({
  wrapperSelector = '[data-spotlight]',
  veilSelector = '[data-spotlight-veil]',
  radius = 140,
} = {}) {
  const areas = document.querySelectorAll(wrapperSelector);
  if (!areas.length) return;

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse) return;

  areas.forEach(area => {
    const veil = area.querySelector(veilSelector);
    if (!veil) return;

    area.style.setProperty('--r', `${radius}px`);

    let raf = null;
    const move = e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = area.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const cx = Math.max(0, Math.min(x, rect.width));
        const cy = Math.max(0, Math.min(y, rect.height));
        area.style.setProperty('--x', `${cx}px`);
        area.style.setProperty('--y', `${cy}px`);
        raf = null;
      });
    };

    const leave = () => {
      const rect = area.getBoundingClientRect();
      area.style.setProperty('--x', `${rect.width / 2}px`);
      area.style.setProperty('--y', `${rect.height / 2}px`);
    };

    area.addEventListener('mousemove', move);
    area.addEventListener('mouseleave', leave);
  });
}
