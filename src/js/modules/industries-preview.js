import { CLASSES } from './constants';

export function initIndustryCardsFollowPreview() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const section = document.querySelector('.section-industries');
  if (!section) return;

  const cards = section.querySelectorAll('[data-industry-card]');
  if (!cards.length) return;

  const PREVIEW_OFFSET = 0;
  const LERP = 0.18;

  // колізія: запас, щоб ховалось трохи раніше, і гістерезис, щоб не мигало
  const COLLIDE_GAP = 12; // px
  const HYSTERESIS = 6; // px

  const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);
  const getLocalXY = (e, el) => {
    const r = el.getBoundingClientRect();
    let x = e.clientX - r.left + PREVIEW_OFFSET;
    let y = e.clientY - r.top + PREVIEW_OFFSET;
    return [clamp(x, 0, r.width), clamp(y, 0, r.height)];
  };

  const growRect = (r, g) => ({
    left: r.left - g,
    top: r.top - g,
    right: r.right + g,
    bottom: r.bottom + g,
  });

  const intersects = (a, b) =>
    !(
      a.right < b.left ||
      a.left > b.right ||
      a.bottom < b.top ||
      a.top > b.bottom
    );

  cards.forEach(card => {
    const preview = card.querySelector('[data-industry-card-img]');
    if (!preview) return;

    // елементи, з якими не можна перетинатись
    const blockers = card.querySelectorAll(
      '.industry-card__info, .industry-card__btn-box'
    );
    let blockerRects = [];

    let rafTick = null;
    let cx = 0,
      cy = 0,
      tx = 0,
      ty = 0;
    let hidden = false; // стан прев’ю (сховане через колізію чи ні)

    const recalcBlockers = () => {
      blockerRects = Array.from(blockers).map(el => el.getBoundingClientRect());
    };

    const applyXY = (x, y) => {
      preview.style.setProperty('--px', x + 'px');
      preview.style.setProperty('--py', y + 'px');
    };

    const checkCollisionAndToggle = () => {
      // поточний rect прев’ю (з урахуванням transform)
      const pr = preview.getBoundingClientRect();

      // коли вже приховано — використовуємо більший буфер (гістерезис), щоб знов не блимнуло
      const gap = hidden ? COLLIDE_GAP + HYSTERESIS : COLLIDE_GAP;

      const collide = blockerRects.some(r => intersects(pr, growRect(r, gap)));

      if (collide && !hidden) {
        hidden = true;
        preview.classList.add('is-hidden');
      } else if (!collide && hidden) {
        hidden = false;
        preview.classList.remove('is-hidden');
      }
    };

    const render = () => {
      const dx = tx - cx,
        dy = ty - cy;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        cx = tx;
        cy = ty;
        applyXY(cx, cy);
        // перевіряємо колізію після оновлення позиції
        checkCollisionAndToggle();
        rafTick = null;
        return;
      }
      cx += dx * LERP;
      cy += dy * LERP;
      applyXY(cx, cy);
      checkCollisionAndToggle();
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
      applyXY(x, y);
      // force reflow
      // eslint-disable-next-line no-unused-expressions
      preview.offsetHeight;
      preview.style.transition = prevTransition;
      checkCollisionAndToggle();
    };

    const onEnter = e => {
      recalcBlockers();
      preview.style.willChange = 'transform';
      const [x, y] = getLocalXY(e, card);
      setInstant(x, y);
      requestAnimationFrame(() => card.classList.add(CLASSES.ACTIVE));
    };

    const onMove = e => {
      const [x, y] = getLocalXY(e, card);
      setTarget(x, y);
    };

    const onLeave = () => {
      card.classList.remove(CLASSES.ACTIVE);
      preview.style.willChange = '';
      preview.classList.remove('is-hidden');
      hidden = false;
      if (rafTick) {
        cancelAnimationFrame(rafTick);
        rafTick = null;
      }
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', recalcBlockers);
  });
}
