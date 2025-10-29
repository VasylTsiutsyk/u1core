// curve-on-scroll.js

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initCurveOnScroll({
  svgSel = '[data-curve]',
  pathSel = '[data-curve-path]',
  axisGroupSel = '[data-curve-axis]',
  trigger = document.body,
  start = 'top bottom',
  end = 'bottom top',
  scrub = 0.6,
  maxBend = 280, // наскільки «вигинати» білу
  axisMaxAngle = 75, // на скільки «класти» жовту (вліво); постав від’ємне — вправо
  pad = 4, // поля від країв viewBox
} = {}) {
  const svg = document.querySelector(svgSel);
  if (!svg) return;

  const path = svg.querySelector(pathSel);
  if (!path) return;

  const axis = svg?.querySelector(axisGroupSel);

  // Визначення розмірів зі viewBox (пріоритет) або з DOM-розміру
  const getBox = () => {
    const vb = svg.viewBox?.baseVal;
    if (vb?.width && vb?.height) return { w: vb.width, h: vb.height };
    const r = svg.getBoundingClientRect();
    return { w: r.width, h: r.height };
  };

  let W = 0,
    H = 0;

  // Малювання кривої Безьє та оновлення точки обертання жовтої осі
  const draw = bend => {
    const x0 = pad,
      y0 = pad; // P0 (верх-ліво)
    const x3 = W - pad,
      y3 = H - pad; // P3 (низ-право)
    const x1 = x0,
      y1 = y0; // P1 (горизонтальна дотична)
    const x2 = x3,
      y2 = y3 - bend; // P2 (над P3 на bend)

    path.setAttribute(
      'd',
      `M ${x0} ${y0} C ${x1} ${y1}, ${x2} ${y2}, ${x3} ${y3}`
    );

    if (axis) gsap.set(axis, { svgOrigin: `${x3} ${y3}` }); // обертати навколо нижньої точки
  };

  // Оновити розміри і домалювати під поточний прогрес
  const measureAndRender = (progress = 0) => {
    const box = getBox();
    W = box.w;
    H = box.h;
    draw(progress * maxBend);
    if (axis) gsap.set(axis, { rotation: -axisMaxAngle * progress });
  };

  // Стартовий стан
  measureAndRender(0);

  // ScrollTrigger: гнемо білу та повертаємо жовту згідно прогресу
  ScrollTrigger.create({
    trigger:
      typeof trigger === 'string' ? document.querySelector(trigger) : trigger,
    start,
    end,
    scrub,
    invalidateOnRefresh: true,
    onUpdate: self => {
      const p = self.progress;
      draw(p * maxBend);
      if (axis) gsap.set(axis, { rotation: -axisMaxAngle * p });
    },
    onRefresh: self => measureAndRender(self.progress),
  });

  // На ресайз просто рефрешимо ST (onRefresh усе перераховує)
  window.addEventListener('resize', () => ScrollTrigger.refresh());
}
