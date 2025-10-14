import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

export function initEcosystem({
  stickyOffset = 80, // відступ зверху під фіксований хедер
  scrub = 0.6, // плавність скрол-анімації
  breakpoint = 992, // мінімальна ширина для анімації
} = {}) {
  const section = document.querySelector('.section-ecosystem');
  if (!section) return;

  const mm = gsap.matchMedia();

  // ----- only >= 992px -----
  mm.add(`(min-width: ${breakpoint}px)`, () => {
    const text = section.querySelector('.section-ecosystem__text');
    const stack = section.querySelector('.section-ecosystem__stack');
    const cards = section.querySelectorAll('[data-parallax]');

    const triggers = [];

    // 1) Pin лівої колонки (текст статичний під час скролу секції)
    if (text && stack) {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: `top top+=${stickyOffset}`,
          end: () => `+=${Math.max(0, stack.scrollHeight - text.offsetHeight)}`,
          pin: text,
          pinSpacing: false,
          invalidateOnRefresh: true,
        })
      );
    }

    // 2) Паралакс карток (рух вгору на data-parallax)
    cards.forEach((card, i) => {
      const dist = parseFloat(card.dataset.parallax) || 60 * (i + 1);

      const move = gsap.fromTo(
        card,
        { y: 0 },
        {
          y: -dist,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
            invalidateOnRefresh: true,
          },
        }
      );

      const reveal = gsap.from(card, {
        autoAlpha: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 85%' },
      });

      triggers.push(move.scrollTrigger, reveal.scrollTrigger);
    });

    // рефреш після завантаження/ресайзу
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);

    // cleanup, коли медіа-запит стає неактивним
    return () => {
      triggers.forEach(t => t && t.kill());
      gsap.set(section.querySelectorAll('[data-parallax]'), {
        clearProps: 'transform,opacity',
      });
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
    };
  });

  // ----- < 992px: гарантуємо відсутність трансформів/пінів -----
  mm.add(`(max-width: ${breakpoint - 0.02}px)`, () => {
    const cards = section.querySelectorAll('[data-parallax]');
    gsap.set(cards, { clearProps: 'transform,opacity' });
    return () => {};
  });
}
