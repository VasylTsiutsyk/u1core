import { CLASSES } from './constants';

export function initReviewsExpand() {
  document.querySelectorAll('[data-reviews]').forEach(section => {
    const wrap = section.querySelector('[data-reviews-cards]');
    const btn = section.querySelector('[data-reviews-more-btn]');
    if (!wrap || !btn) return;

    const textEl = btn.querySelector('.btn__text');
    const iconEl = btn.querySelector('i');

    const MORE = btn.dataset.reviewsMoreText || 'Load more';
    const LESS = btn.dataset.reviewsLessText || 'Show less';

    const applyState = expanded => {
      wrap.classList.toggle(CLASSES.EXPANDED, expanded);
      btn.setAttribute('aria-expanded', String(expanded));

      if (textEl) textEl.textContent = expanded ? LESS : MORE;

      if (iconEl) {
        iconEl.classList.remove(expanded ? 'icon-plus' : 'icon-minus');
        iconEl.classList.add(expanded ? 'icon-minus' : 'icon-plus');
      }
    };

    btn.addEventListener('click', e => {
      e.preventDefault();
      applyState(!wrap.classList.contains(CLASSES.EXPANDED));
    });

    applyState(wrap.classList.contains(CLASSES.EXPANDED));
  });
}
