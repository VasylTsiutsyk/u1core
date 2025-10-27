// js/modules/selects.js

// ===== SELECT ===== //
// DOC: https://github.com/Choices-js/Choices
// HTML: s-sel

import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.css';

function initSelects() {
  const selects = document.querySelectorAll('[data-select]');
  if (!selects.length) return;

  selects.forEach(select => {
    const searchAttr = select.dataset.selectSearch;
    const placeholderAttr = select.dataset.selectPlaceholder;
    const removeBtnAttr = select.dataset.selectRemoveButton;
    const placeholder = placeholderAttr || 'Select an option';

    const choices = new Choices(select, {
      searchEnabled: !!searchAttr,
      itemSelectText: '',
      placeholderValue: placeholder,
      shouldSort: false,
      allowHTML: false,
      removeItemButton: removeBtnAttr === 'true',
      duplicateItemsAllowed: false,
      placeholder: true,
      searchPlaceholderValue: 'Search…',
      renderSelectedChoices: 'auto',
    });

    // optionally save the instance for later use (destroy, update etc.)
    select._choicesInstance = choices;

    select.addEventListener('showDropdown', () => {
      const ddScroll = select
        .closest('.choices')
        ?.querySelector('.choices__list--dropdown .choices__list');

      if (ddScroll) {
        ddScroll.setAttribute('data-lenis-prevent', '');

        ddScroll.style.overscrollBehavior = 'contain';
        ddScroll.style.webkitOverflowScrolling = 'touch';
      }
    });
  });
}

export default initSelects;
