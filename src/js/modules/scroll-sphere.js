import { CLASSES } from './constants';

export function initFooterBottomSphere() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const footer = document.querySelector('.footer');
  if (!footer) return;

  const scope = footer.querySelector('.footer-bottom');
  if (!scope) return;

  const sphere = footer.querySelector('[data-sphere-btn]');
  if (!sphere) return;

  const INTERACTIVE_SEL =
    'a, button, input, select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"])';

  const PREVIEW_OFFSET = 0;
  const LERP = 0.18;

  const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

  const getLocalXY = e => {
    const fr = footer.getBoundingClientRect();
    let x = e.clientX - fr.left + PREVIEW_OFFSET;
    let y = e.clientY - fr.top + PREVIEW_OFFSET;
    return [x, y];
  };

  const clampToScope = (x, y) => {
    const fr = footer.getBoundingClientRect();
    const sr = scope.getBoundingClientRect();
    const minX = sr.left - fr.left;
    const maxX = sr.right - fr.left;
    const minY = sr.top - fr.top;
    const maxY = sr.bottom - fr.top;
    return [clamp(x, minX, maxX), clamp(y, minY, maxY)];
  };

  const inScope = (clientX, clientY) => {
    const r = scope.getBoundingClientRect();
    return (
      clientX >= r.left &&
      clientX <= r.right &&
      clientY >= r.top &&
      clientY <= r.bottom
    );
  };

  let rafTick = null;
  let cx = 0,
    cy = 0,
    tx = 0,
    ty = 0;
  let active = false;
  let enabled = false;

  const applyVars = (x, y) => {
    sphere.style.setProperty('--px', x + 'px');
    sphere.style.setProperty('--py', y + 'px');
  };

  const render = () => {
    const dx = tx - cx,
      dy = ty - cy;
    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
      cx = tx;
      cy = ty;
      applyVars(cx, cy);
      rafTick = null;
      return;
    }
    cx += dx * LERP;
    cy += dy * LERP;
    applyVars(cx, cy);
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
    const prev = sphere.style.transition;
    sphere.style.transition = 'none';
    applyVars(x, y);

    sphere.offsetHeight;
    sphere.style.transition = prev;
  };

  const show = () => {
    if (active) return;
    active = true;
    document.body.classList.add('is-sphere-cursor');
    sphere.classList.add(CLASSES.ACTIVE);
  };

  const hide = () => {
    if (!active) return;
    active = false;
    document.body.classList.remove('is-sphere-cursor');
    sphere.classList.remove(CLASSES.ACTIVE);
    if (rafTick) {
      cancelAnimationFrame(rafTick);
      rafTick = null;
    }
  };

  const onEnter = e => {
    if (e.target.closest(INTERACTIVE_SEL)) return;
    sphere.style.willChange = 'transform';
    let [x, y] = getLocalXY(e);
    [x, y] = clampToScope(x, y);
    setInstant(x, y);
    requestAnimationFrame(show);
  };

  const onMove = e => {
    const overInteractive = e.target.closest(INTERACTIVE_SEL);
    const inside = inScope(e.clientX, e.clientY);

    if (!inside) {
      onLeave();
      return;
    }

    let [x, y] = getLocalXY(e);
    [x, y] = clampToScope(x, y);

    if (overInteractive) {
      cx = tx = x;
      cy = ty = y;
      hide();
      return;
    }

    if (!active) {
      setInstant(x, y);
      show();
      return;
    }
    setTarget(x, y);
  };

  const onLeave = () => {
    sphere.style.willChange = '';
    hide();
  };

  const onScopeClick = e => {
    if (!active) return;
    if (e.target.closest(INTERACTIVE_SEL)) return;

    const fr = footer.getBoundingClientRect();
    const clickX = e.clientX - fr.left;
    const clickY = e.clientY - fr.top;
    const r = sphere.offsetWidth / 2;
    const dx = clickX - cx;
    const dy = clickY - cy;

    if (dx * dx + dy * dy <= r * r) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      hide();
    }
  };

  const mql = window.matchMedia('(min-width: 992px)');

  const enable = () => {
    if (enabled) return;
    enabled = true;

    scope.addEventListener('mouseenter', onEnter);
    scope.addEventListener('mousemove', onMove);
    scope.addEventListener('mouseleave', onLeave);
    scope.addEventListener('click', onScopeClick);

    window.addEventListener('scroll', onLeave, { passive: true });
    window.addEventListener('resize', onLeave);
  };

  const disable = () => {
    if (!enabled) return;
    enabled = false;
    onLeave();
    scope.removeEventListener('mouseenter', onEnter);
    scope.removeEventListener('mousemove', onMove);
    scope.removeEventListener('mouseleave', onLeave);
    scope.removeEventListener('click', onScopeClick);
    window.removeEventListener('scroll', onLeave);
    window.removeEventListener('resize', onLeave);
  };

  const handleMQ = e => (e.matches ? enable() : disable());

  if (mql.matches) enable();

  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', handleMQ);
  } else {
    // Safari ≤14
    mql.addListener(handleMQ);
  }
}
