export function initBeforeAfter({
  selector = '[data-ba]',
  resetOnEnd = true,
} = {}) {
  const roots = document.querySelectorAll(selector);
  if (!roots.length) return;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const pct = r => `${Math.round(r * 100)}%`;

  roots.forEach(root => {
    const track = root.querySelector('[data-ba-track]');
    const overlay = root.querySelector('[data-ba-overlay]');
    const handle = root.querySelector('[data-ba-handle]');
    if (!track || !overlay || !handle) return;

    const vertical =
      (root.dataset.baOrientation || 'horizontal') === 'vertical';
    const defPct = Math.max(
      0,
      Math.min(100, Number(root.dataset.baDefault ?? 50))
    );

    let pos = defPct / 100;
    let rect = track.getBoundingClientRect();

    let sizeRaf = 0;

    const setSizeVar = () => {
      if (sizeRaf) cancelAnimationFrame(sizeRaf);

      sizeRaf = requestAnimationFrame(() => {
        rect = track.getBoundingClientRect();
        const size = vertical ? rect.height : rect.width;
        root.style.setProperty('--width', `${Math.round(size)}px`);
      });
    };

    const limits = () => {
      const hRect = handle.getBoundingClientRect();
      rect = track.getBoundingClientRect();
      const half = vertical ? hRect.height / 2 : hRect.width / 2;
      const size = vertical ? rect.height : rect.width;
      const min = half / size;
      const max = 1 - min;
      return { min: Math.max(0, min), max: Math.min(1, max) };
    };

    const setPos = (r, { animate = true } = {}) => {
      const { min, max } = limits();
      pos = clamp(r, min, max);

      const v = pct(pos);
      root.style.setProperty('--pos', v);
      handle.setAttribute('aria-valuenow', Math.round(pos * 100));

      if (!animate) root.classList.add('is-dragging');
      else root.classList.remove('is-dragging');
    };

    const ratioFromEvent = e => {
      const ex = 'clientX' in e ? e.clientX : e.touches?.[0]?.clientX;
      const ey = 'clientY' in e ? e.clientY : e.touches?.[0]?.clientY;
      return vertical
        ? (ey - rect.top) / rect.height
        : (ex - rect.left) / rect.width;
    };

    const start = e => {
      e.preventDefault();
      rect = track.getBoundingClientRect();
      setSizeVar(); // оновити --width перед драгом
      setPos(ratioFromEvent(e), { animate: false });

      const move = ev => setPos(ratioFromEvent(ev), { animate: false });
      const end = () => {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('touchmove', move, { passive: false });
        window.removeEventListener('mouseup', end);
        window.removeEventListener('touchend', end);

        root.classList.remove('is-dragging');
        if (resetOnEnd) {
          requestAnimationFrame(() => setPos(defPct / 100, { animate: true }));
        }
      };

      window.addEventListener('mousemove', move);
      window.addEventListener('touchmove', move, { passive: false });
      window.addEventListener('mouseup', end, { once: true });
      window.addEventListener('touchend', end, { once: true });
    };

    handle.addEventListener('mousedown', start);
    handle.addEventListener('touchstart', start, { passive: false });

    root.addEventListener('mouseleave', () => {
      if (root.classList.contains('is-dragging')) return;
      setPos(defPct / 100, { animate: true });
    });

    const ro = new ResizeObserver(() => {
      setSizeVar();
      setPos(pos);
    });

    ro.observe(track);
    ro.observe(handle);

    window.addEventListener(
      'resize',
      () => {
        setSizeVar();
        setPos(pos);
      },
      { passive: true }
    );

    setSizeVar();
    setPos(defPct / 100);
  });
}
