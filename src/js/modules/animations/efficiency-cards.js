import { CLASSES } from '../constants';

export function initEfficiencyCards({
  listSelector = '[data-efficiency-cards]',
  cardSelector = '[data-efficiency-card]',
  activeClass = CLASSES.ACTIVE,
  autoMs = 3000, // інтервал автоперемикання (мс)
  autoplay = true, // вмикати автоплей
  pauseOnInteract = true, // пауза на hover/focus
} = {}) {
  document.querySelectorAll(listSelector).forEach(list => {
    const cards = Array.from(list.querySelectorAll(cardSelector));
    if (!cards.length) return;

    let current = null;

    const setActive = (card, { force = false } = {}) => {
      if (!card || (!force && card === current)) return;

      if (current) {
        current.classList.remove(activeClass);
        current.removeAttribute('aria-current');
        current.style.removeProperty('--data-progress');
      }

      current = card;
      current.classList.add(activeClass);
      current.setAttribute('aria-current', 'true');
      current.style.setProperty('--data-progress', '0%');
    };

    setActive(cards[0], { force: true });

    const gotoNext = () => {
      const i = cards.indexOf(current);
      const next = cards[(i + 1) % cards.length];
      setActive(next);
    };

    list.addEventListener('click', e => {
      const card = e.target.closest(cardSelector);
      if (!card || !list.contains(card)) return;
      setActive(card);
      restart();
    });

    list.addEventListener('keydown', e => {
      const card = e.target.closest(cardSelector);
      if (!card) return;
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setActive(card);
        restart();
      }
    });

    // --- автоплей з прогресом у --data-progress ---
    let rafId = null;
    let startTs = 0;
    let paused = false;

    const tick = t => {
      if (paused) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const elapsed = t - startTs;
      const p = Math.min(elapsed / autoMs, 1);

      // оновлюємо прогрес активної картки
      current.style.setProperty(
        '--data-progress',
        `${((p / 100) * 100).toFixed(2)}`
      );

      if (p >= 1) {
        gotoNext();
        startTs = performance.now();
      }

      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!autoplay || rafId) return;
      startTs = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    };

    const restart = () => {
      stop();
      start();
    };

    // пауза на взаємодії
    if (pauseOnInteract) {
      const pause = () => {
        paused = true;
      };

      const resume = () => {
        paused = false;
        startTs = performance.now();
      };

      list.addEventListener('mouseenter', pause);
      list.addEventListener('mouseleave', resume);
      list.addEventListener('focusin', pause);
      list.addEventListener('focusout', resume);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) paused = true;
        else resume();
      });
    }

    // старт
    start();
  });
}
