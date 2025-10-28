// project-card-follow-btn.js

import { CLASSES } from './constants';

export function initProjectCardFollowBtn() {
  // вимикаємо на тачах
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  const LERP = 0.15; // плавність доганяння
  const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

  const getLocalXY = (e, el) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    return [clamp(x, 0, r.width), clamp(y, 0, r.height)];
  };

  cards.forEach(card => {
    const btn = card.querySelector('.project-card__btn');
    if (!btn) return;

    let rafTick = null;
    let cx = 0,
      cy = 0; // current
    let tx = 0,
      ty = 0; // target

    const apply = (x, y) => {
      btn.style.setProperty('--px', x + 'px');
      btn.style.setProperty('--py', y + 'px');
    };

    const render = () => {
      const dx = tx - cx,
        dy = ty - cy;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        cx = tx;
        cy = ty;
        apply(cx, cy);
        rafTick = null;
        return;
      }
      cx += dx * LERP;
      cy += dy * LERP;
      apply(cx, cy);
      rafTick = requestAnimationFrame(render);
    };

    const setTarget = (x, y) => {
      const r = card.getBoundingClientRect();
      // утримуємо центр кнопки в межах картки
      tx = clamp(x, 0, r.width);
      ty = clamp(y, 0, r.height);
      if (!rafTick) rafTick = requestAnimationFrame(render);
    };

    const setInstant = (x, y) => {
      cx = tx = x;
      cy = ty = y;
      const prev = btn.style.transition;
      btn.style.transition = 'none';
      apply(x, y);
      // force reflow
      // eslint-disable-next-line no-unused-expressions
      btn.offsetHeight;
      btn.style.transition = prev;
    };

    const onEnter = e => {
      const [x, y] = getLocalXY(e, card);
      setInstant(x, y);
      requestAnimationFrame(() => btn.classList.add(CLASSES.ACTIVE)); // is-active
    };

    const onMove = e => {
      const [x, y] = getLocalXY(e, card);
      setTarget(x, y);
    };

    const onLeave = () => {
      btn.classList.remove(CLASSES.ACTIVE);
      if (rafTick) {
        cancelAnimationFrame(rafTick);
        rafTick = null;
      }
    };

    // делегований клік: якщо користувач клікає «в кнопку» — активуємо посилання
    const onClick = e => {
      if (!btn.classList.contains(CLASSES.ACTIVE)) return;

      const [mx, my] = getLocalXY(e, card);
      const dx = mx - cx;
      const dy = my - cy;
      const radius = (btn.offsetWidth || 48) * 0.5; // приблизний радіус
      if (dx * dx + dy * dy <= radius * radius) {
        // клік по «області кнопки»
        e.preventDefault();
        const href = btn.getAttribute('href');
        if (href) window.location.href = href;
        else btn.dispatchEvent(new Event('click', { bubbles: true }));
      }
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    card.addEventListener('click', onClick);
  });
}
