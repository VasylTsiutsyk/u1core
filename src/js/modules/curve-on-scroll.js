// curve-on-scroll.js
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initCurveOnScroll({
  svgSel = '[data-curve]',
  pathSel = '[data-curve-path]',
  trigger = document.body, // або будь-яка секція
  start = 'top bottom', // коли почати
  end = 'bottom top', // коли закінчити
  scrub = 0.6,
  maxBend = 280, // макс. вигин у px (зміни знак, щоб гнути в інший бік)
  pad = 4,
} = {}) {
  const svg = document.querySelector(svgSel);
  const path = svg?.querySelector(pathSel);

  if (!svg || !path) return;

  const getBox = () => {
    const vb = svg.viewBox?.baseVal;
    if (vb && vb.width && vb.height)
      return {
        w: vb.width,
        h: vb.height,
      };

    const r = svg.getBoundingClientRect();
    return {
      w: r.width,
      h: r.height,
    };
  };

  let W = 0,
    H = 0;

  const draw = (bend = 0) => {
    // точки: P0 → P3, P1 = P0 (гор. дотик), P2 над P3 на bend px (верт. дотик)
    const x0 = pad,
      y0 = pad;
    const x3 = W - pad,
      y3 = H - pad;
    const x1 = x0,
      y1 = y0;
    const x2 = x3,
      y2 = y3 - bend;

    const d = `M ${x0} ${y0} C ${x1} ${y1}, ${x2} ${y2}, ${x3} ${y3}`;
    path.setAttribute('d', d);
  };

  const refresh = () => {
    ({ w: W, h: H } = getBox());
    // перемальовуємо під поточний прогрес ScrollTrigger
    const st = ScrollTrigger.getById('curveST');
    const p = st ? st.progress : 0;
    draw(p * maxBend);
  };

  // ScrollTrigger
  ScrollTrigger.create({
    id: 'curveST',
    trigger,
    start,
    end,
    scrub,
    invalidateOnRefresh: true,
    onUpdate: self => draw(self.progress * maxBend),
    onRefresh: refresh,
  });

  refresh();

  window.addEventListener('resize', () => ScrollTrigger.refresh());
}
