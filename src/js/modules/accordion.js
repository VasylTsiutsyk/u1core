// js/modules/accordion.js

import { CLASSES } from './constants';

function activateControl(btn) {
  if (!btn) return;

  btn.setAttribute('aria-expanded', 'true');
  btn.classList.add(CLASSES.ACTIVE);
}

function deactivateControl(btn) {
  if (!btn) return;

  btn.setAttribute('aria-expanded', 'false');
  btn.classList.remove(CLASSES.ACTIVE);
}

function activateContent(content) {
  if (!content) return;

  content.classList.add(CLASSES.ACTIVE);
  content.setAttribute('aria-hidden', 'false');
}

function deactivateContent(content) {
  if (!content) return;

  content.classList.remove(CLASSES.ACTIVE);
  content.setAttribute('aria-hidden', 'true');
}

function toggleAccordion(btn, content, expand = true) {
  if (expand) {
    activateControl(btn);
    activateContent(content);
  } else {
    deactivateControl(btn);
    deactivateContent(content);
  }
}

/**
 * Ініціалізація акордеонів
 * @param {string} selector - Селектор акордеонів (за замовчуванням '.accordion')
 * @param {Object} options - Налаштування
 * @param {boolean} options.showOnlyOne - Чи відкривати тільки один акордеон в групі
 * @param {boolean} options.closeOnClickOutside - Чи закривати акордеони при кліку поза ними
 */

function initAccordions(
  selector = '.accordion',
  { showOnlyOne = false, closeOnClickOutside = false } = {}
) {
  const accordions = document.querySelectorAll(selector);
  if (!accordions.length) return;

  accordions.forEach((accordion, index) => {
    const btn =
      accordion.querySelector(`${selector}__btn`) ||
      accordion.querySelector('.accordion__btn');

    const content =
      accordion.querySelector(`${selector}__content`) ||
      accordion.querySelector('.accordion__content');

    if (!btn || !content) return;

    const btnId = `${selector.replace('.', '')}-btn-${index}`;
    const contentId = `${selector.replace('.', '')}-content-${index}`;

    btn.setAttribute('id', btnId);
    btn.setAttribute('aria-controls', contentId);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute(
      'aria-label',
      btn.innerText || `Accordion Btn ${index + 1}`
    );
    btn.setAttribute('title', btn.innerText || `Accordion Btn ${index + 1}`);

    content.setAttribute('id', contentId);
    content.setAttribute('aria-labelledby', btnId);
    content.setAttribute('aria-hidden', 'true');

    btn.addEventListener('click', e => {
      e.preventDefault();

      const isActive = accordion.classList.contains(CLASSES.ACTIVE);

      if (showOnlyOne) {
        accordions.forEach(item => {
          const itemBtn =
            item.querySelector(`${selector}__btn`) ||
            item.querySelector('.accordion__btn');

          const itemContent =
            item.querySelector(`${selector}__content`) ||
            item.querySelector('.accordion__content');

          if (itemBtn && itemContent) {
            item.classList.remove(CLASSES.ACTIVE);
            toggleAccordion(itemBtn, itemContent, false);
          }
        });
      }

      if (!isActive) {
        accordion.classList.add(CLASSES.ACTIVE);
        toggleAccordion(btn, content, true);
      } else {
        accordion.classList.remove(CLASSES.ACTIVE);
        toggleAccordion(btn, content, false);
      }
    });
  });

  // Закривання при кліку поза акордеоном
  if (closeOnClickOutside) {
    document.addEventListener('click', e => {
      const target = e.target;

      if (!target.closest(selector)) {
        accordions.forEach(accordion => {
          if (accordion.classList.contains(CLASSES.ACTIVE)) {
            const btn =
              accordion.querySelector(`${selector}__btn`) ||
              accordion.querySelector('.accordion__btn');

            const content =
              accordion.querySelector(`${selector}__content`) ||
              accordion.querySelector('.accordion__content');

            if (btn && content) {
              accordion.classList.remove(CLASSES.ACTIVE);
              toggleAccordion(btn, content, false);
            }
          }
        });
      }
    });
  }
}

export default initAccordions;
