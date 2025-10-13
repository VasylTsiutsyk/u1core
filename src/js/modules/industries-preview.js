import { CLASSES } from './constants';

export function initIndustryCardsFollowPreview() {
  // вимикаємо на coarse-пристроях (тач)
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const section = document.querySelector('.section-industries');
  if (!section) return;

  const cards = section.querySelectorAll('[data-industry-card]');
  if (!cards.length) return;

  const PREVIEW_OFFSET = 8; // відступ від курсора

  cards.forEach(card => {
    const preview = card.querySelector('[data-industry-card-img]');
    if (!preview) return;

    let raf = null;

    const updatePos = (x, y) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        preview.style.setProperty('--px', x + 'px');
        preview.style.setProperty('--py', y + 'px');
        raf = null;
      });
    };

    const onEnter = e => {
      card.classList.add(CLASSES.ACTIVE);
      onMove(e);
    };

    const onMove = e => {
      const rect = card.getBoundingClientRect();

      let x = e.clientX - rect.left + PREVIEW_OFFSET;
      let y = e.clientY - rect.top + PREVIEW_OFFSET;

      if (x < 0) x = 0;
      else if (x > rect.width) x = rect.width;

      if (y < 0) y = 0;
      else if (y > rect.height) y = rect.height;

      updatePos(x, y);
    };

    const onLeave = () => {
      card.classList.remove(CLASSES.ACTIVE);
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
}
