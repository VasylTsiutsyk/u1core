// spotlight-follow.js
export function initSpotlightFollow({
  wrapperSelector = '[data-spotlight]',
  veilSelector = '[data-spotlight-veil]',
  radius = 140, // радіус прозорого центру
  returnDuration = 450, // тривалість повернення в центр, мс
  ease = t => 1 - Math.pow(1 - t, 3), // easeOutCubic
} = {}) {
  const areas = document.querySelectorAll(wrapperSelector);
  if (!areas.length) return;

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse) return;

  areas.forEach(area => {
    const veil = area.querySelector(veilSelector);
    if (!veil) return;

    area.style.setProperty('--r', `${radius}px`);

    let lastX = null;
    let lastY = null;

    let moveRaf = null;

    let returnRaf = null;
    let returnStart = 0;

    const centerTo = () => {
      const rect = area.getBoundingClientRect();
      return { cx: rect.width / 2, cy: rect.height / 2 };
    };

    const setPos = (x, y) => {
      area.style.setProperty('--x', `${x}px`);
      area.style.setProperty('--y', `${y}px`);
      lastX = x;
      lastY = y;
    };

    {
      const { cx, cy } = centerTo();
      setPos(cx, cy);
    }

    const cancelReturn = () => {
      if (returnRaf) {
        cancelAnimationFrame(returnRaf);
        returnRaf = null;
      }
    };

    const move = e => {
      cancelReturn();
      if (moveRaf) return;

      moveRaf = requestAnimationFrame(() => {
        const rect = area.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nx = Math.max(0, Math.min(x, rect.width));
        const ny = Math.max(0, Math.min(y, rect.height));
        setPos(nx, ny);

        moveRaf = null;
      });
    };

    const leave = () => {
      cancelReturn();
      const { cx, cy } = centerTo();
      const sx = lastX ?? cx;
      const sy = lastY ?? cy;
      const dx = cx - sx;
      const dy = cy - sy;

      returnStart = performance.now();

      const step = now => {
        const t = Math.min(1, (now - returnStart) / returnDuration);
        const k = ease(t);
        setPos(sx + dx * k, sy + dy * k);

        if (t < 1) {
          returnRaf = requestAnimationFrame(step);
        } else {
          returnRaf = null;
        }
      };

      returnRaf = requestAnimationFrame(step);
    };

    const enter = e => {
      cancelReturn();
      move(e);
    };

    area.addEventListener('mousemove', move);
    area.addEventListener('mouseenter', enter);
    area.addEventListener('mouseleave', leave);
  });
}
