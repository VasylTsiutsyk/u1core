import { CLASSES } from './constants';

export function initEfficiencyCards({
  listSelector = '[data-efficiency-cards]',
  cardSelector = '[data-efficiency-card]',
  activeClass = CLASSES.ACTIVE,
} = {}) {
  document.querySelectorAll(listSelector).forEach(list => {
    const cards = Array.from(list.querySelectorAll(cardSelector));
    if (!cards.length) return;

    const first = cards[0];

    const setActive = card => {
      cards.forEach(c => {
        c.classList.remove(activeClass);
        c.removeAttribute('aria-current');
      });

      card.classList.add(activeClass);
      card.setAttribute('aria-current', 'true');
    };

    const initial = cards.find(c => c.classList.contains(activeClass)) || first;
    setActive(initial);

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => setActive(card));
      card.addEventListener('focusin', () => setActive(card));
      card.addEventListener('click', () => setActive(card));
    });

    list.addEventListener('mouseleave', () => setActive(first));

    list.addEventListener('focusout', e => {
      if (!list.contains(e.relatedTarget)) setActive(first);
    });
  });
}
