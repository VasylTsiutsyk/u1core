import { CLASSES } from '../constants';

export function initEfficiencyCards({
  listSelector = '[data-efficiency-cards]',
  cardSelector = '[data-efficiency-card]',
  activeClass = CLASSES.ACTIVE,
} = {}) {
  document.querySelectorAll(listSelector).forEach(list => {
    const cards = Array.from(list.querySelectorAll(cardSelector));
    if (!cards.length) return;

    let current =
      cards.find(c => c.classList.contains(activeClass)) || cards[0];

    const setActive = card => {
      if (!card || card === current) return;
      current.classList.remove(activeClass);
      current.removeAttribute('aria-current');

      current = card;
      current.classList.add(activeClass);
      current.setAttribute('aria-current', 'true');
    };

    cards.forEach(c => {
      c.classList.remove(activeClass);
      c.removeAttribute('aria-current');
    });

    current.classList.add(activeClass);
    current.setAttribute('aria-current', 'true');

    list.addEventListener('click', e => {
      const card = e.target.closest(cardSelector);
      if (!card || !list.contains(card)) return;
      setActive(card);
    });

    list.addEventListener('keydown', e => {
      const card = e.target.closest(cardSelector);
      if (!card) return;
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setActive(card);
      }
    });
  });
}
