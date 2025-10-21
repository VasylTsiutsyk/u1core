import { CLASSES } from './constants';

export function initIndustryCardsFollowPreview() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const section = document.querySelector('.section-industries');
  if (!section) return;

  const cards = section.querySelectorAll('[data-industry-card]');
  if (!cards.length) return;

  const PREVIEW_OFFSET = 0;
  const LERP = 0.18;

  const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);
  const getLocalXY = (e, el) => {
    const r = el.getBoundingClientRect();
    let x = e.clientX - r.left + PREVIEW_OFFSET;
    let y = e.clientY - r.top + PREVIEW_OFFSET;
    return [clamp(x, 0, r.width), clamp(y, 0, r.height)];
  };

  cards.forEach(card => {
    const preview = card.querySelector('[data-industry-card-img]');
    if (!preview) return;

    let rafTick = null;
    let cx = 0,
      cy = 0,
      tx = 0,
      ty = 0;

    const render = () => {
      const dx = tx - cx,
        dy = ty - cy;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        cx = tx;
        cy = ty;
        preview.style.setProperty('--px', cx + 'px');
        preview.style.setProperty('--py', cy + 'px');
        rafTick = null;
        return;
      }
      cx += dx * LERP;
      cy += dy * LERP;
      preview.style.setProperty('--px', cx + 'px');
      preview.style.setProperty('--py', cy + 'px');
      rafTick = requestAnimationFrame(render);
    };

    const setTarget = (x, y) => {
      tx = x;
      ty = y;
      if (!rafTick) rafTick = requestAnimationFrame(render);
    };

    const setInstant = (x, y) => {
      cx = tx = x;
      cy = ty = y;

      const prevTransition = preview.style.transition;
      preview.style.transition = 'none';
      preview.style.setProperty('--px', x + 'px');
      preview.style.setProperty('--py', y + 'px');

      preview.offsetHeight;
      preview.style.transition = prevTransition;
    };

    const onEnter = e => {
      preview.style.willChange = 'transform';

      const [x, y] = getLocalXY(e, card);
      setInstant(x, y);

      requestAnimationFrame(() => {
        card.classList.add(CLASSES.ACTIVE);
      });
    };

    const onMove = e => {
      const [x, y] = getLocalXY(e, card);
      setTarget(x, y);
    };

    const onLeave = () => {
      card.classList.remove(CLASSES.ACTIVE);
      preview.style.willChange = '';
      if (rafTick) {
        cancelAnimationFrame(rafTick);
        rafTick = null;
      }
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
}
