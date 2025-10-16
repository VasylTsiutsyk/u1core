import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPinnedStacks({
  ns = 'pindeck',
  stickyOffset = 180,
  breakpoint = 992,
  revealOffset = '85%',
} = {}) {
  const roots = document.querySelectorAll(`[data-${ns}]`);
  if (!roots.length) return;

  const mm = gsap.matchMedia();

  roots.forEach(root => {
    const selAside = `[data-${ns}-aside]`;
    const selStack = `[data-${ns}-stack]`;
    const selCard = `[data-${ns}-card]`;

    let rafId = 0;
    const safeRefresh = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        rafId = 0;
      });
    };

    const setupReveal = () => {
      const cards = root.querySelectorAll(selCard);
      cards.forEach(card => {
        gsap.set(card, { clearProps: 'transform,opacity' });
        gsap.from(card, {
          autoAlpha: 0,
          y: 18,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, start: `top ${revealOffset}` },
        });
      });
    };

    const attachObservers = () => {
      const text = root.querySelector(selAside);
      const stack = root.querySelector(selStack);
      if (!text || !stack) return { disconnect() {} };

      const ro = new ResizeObserver(safeRefresh);
      ro.observe(root);
      ro.observe(text);
      ro.observe(stack);

      const mo = new MutationObserver(safeRefresh);
      mo.observe(stack, { childList: true, subtree: true, attributes: true });

      const onCustom = () => safeRefresh();
      root.addEventListener(`${ns}:refresh`, onCustom);

      return {
        disconnect() {
          ro.disconnect();
          mo.disconnect();
          root.removeEventListener(`${ns}:refresh`, onCustom);
        },
      };
    };

    mm.add(`(min-width: ${breakpoint}px)`, () => {
      const text = root.querySelector(selAside);
      const stack = root.querySelector(selStack);

      const observers = attachObservers();
      const triggers = [];

      if (text && stack) {
        triggers.push(
          ScrollTrigger.create({
            trigger: root,
            start: `top top+=${stickyOffset}`,
            end: () =>
              `+=${Math.max(0, stack.scrollHeight - text.offsetHeight)}`,
            pin: text,
            pinSpacing: false,
            invalidateOnRefresh: true,
          })
        );
      }

      setupReveal();
      window.addEventListener('load', safeRefresh, { once: true });

      return () => {
        triggers.forEach(t => t && t.kill());
        observers.disconnect();
      };
    });

    mm.add(`(max-width: ${breakpoint - 0.02}px)`, () => {
      setupReveal();
      return () => {};
    });
  });
}
