import gsap from 'gsap';
import { CLASSES } from './constants';

export function initServices() {
  const section = document.querySelector('[data-services]');
  if (!section) return;

  const cards = gsap.utils.toArray(
    section.querySelectorAll('[data-service-card]')
  );
  if (!cards.length) return;

  const mq = gsap.matchMedia();

  mq.add('(min-width: 992px)', () => {
    let scrollIndex = 0;
    let hoverLock = false;

    const setActive = idx => {
      cards.forEach((c, i) => c.classList.toggle(CLASSES.ACTIVE, i === idx));
    };

    setActive(0);

    const tl = gsap.timeline({
      defaults: { duration: 1 },
      scrollTrigger: {
        trigger: section,
        start: '0% 10%',
        end: `+=${cards.length * 600}`,
        pin: true,
        scrub: 0.5,
        snap: {
          snapTo: value =>
            Math.round(value * (cards.length - 1)) / (cards.length - 1),
          duration: 0.25,
          ease: 'power1.inOut',
        },
        onUpdate: self => {
          if (hoverLock) return;
          const idx = Math.min(
            cards.length - 1,
            Math.max(0, Math.round(self.progress * (cards.length - 1)))
          );
          if (idx !== scrollIndex) {
            scrollIndex = idx;
            setActive(scrollIndex);
          }
        },
      },
    });

    for (let i = 0; i < cards.length; i++) {
      tl.to({}, { duration: 1 });
    }

    cards.forEach((card, i) => {
      const enter = () => {
        hoverLock = true;
        setActive(i);
      };

      const leave = () => {
        hoverLock = false;
        setActive(scrollIndex);
      };

      card.addEventListener('mouseenter', enter);
      card.addEventListener('mouseleave', leave);
      card.addEventListener('focusin', enter);
      card.addEventListener('focusout', leave);
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      cards.forEach(c =>
        c.classList.toggle(CLASSES.ACTIVE, c.dataset.index === '0')
      );
    };
  });

  mq.add('(max-width: 991.98px)', () => {
    const setActive = idx => {
      cards.forEach((c, i) => c.classList.toggle(CLASSES.ACTIVE, i === idx));
    };

    setActive(0);
    cards.forEach((card, i) => {
      const enter = () => setActive(i);
      card.addEventListener('mouseenter', enter);
      card.addEventListener('focusin', enter);
    });
  });
}
