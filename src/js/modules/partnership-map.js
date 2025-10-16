export function initPartnershipsMap({
  rootSelector = '[data-partnerships-map]',
  fieldSelector = '[data-partnerships-map-field]',
  pinSelector = '[data-partnerships-map-pin]',
  cardSelector = '[data-partnerships-map-card]',
  hideDelay = 60,
} = {}) {
  document.querySelectorAll(rootSelector).forEach(root => {
    const field = root.querySelector(fieldSelector) || root;
    const card = root.querySelector(cardSelector);
    if (!card) return;

    const imgEl = card.querySelector('[data-partnerships-map-card-img] img');
    const titleEl = card.querySelector('[data-partnerships-map-card-title]');
    const labelEl = card.querySelector('[data-partnerships-map-card-label]');

    let hideTimer = null;

    const setCardContent = pin => {
      const src = pin.dataset.pinImg || pin.querySelector('img')?.src || '';
      const ttl = pin.dataset.pinTitle || '';
      const cty = pin.dataset.pinCountry || '';

      if (imgEl && src) imgEl.src = src;
      if (titleEl) titleEl.textContent = ttl;
      if (labelEl) labelEl.textContent = cty;

      card.setAttribute('aria-label', [ttl, cty].filter(Boolean).join(', '));
    };

    const showCard = pin => {
      clearTimeout(hideTimer);
      setCardContent(pin);
      card.classList.add('_visible');
    };

    const hideCard = () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(
        () => card.classList.remove('_visible'),
        hideDelay
      );
    };

    field.querySelectorAll(pinSelector).forEach(pin => {
      pin.addEventListener('mouseenter', () => showCard(pin));
      pin.addEventListener('focusin', () => showCard(pin));
      pin.addEventListener('click', e => {
        e.preventDefault();
        showCard(pin);
      });

      pin.addEventListener('mouseleave', hideCard);
      pin.addEventListener('focusout', e => {
        if (!field.contains(e.relatedTarget)) hideCard();
      });
    });

    field.addEventListener('mouseleave', hideCard);
  });
}
