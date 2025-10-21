// js/modules/tooltip.js

// ========== Tooltip ========== //
// DOC: https://atomiks.github.io/tippyjs/

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';

function initTooltips() {
  const elements = document.querySelectorAll('[data-tippy]');
  if (!elements.length) return;

  [...elements].forEach(el => {
    tippy(el, {
      allowHTML: true,
      arrow: false,
      animation: 'shift-away',
      duration: [300, 150],
      theme: 'light-border',
      placement: 'top',
      offset: [0, 10],
      content: el.dataset.tippy,
      maxWidth: 536,
    });
  });
}

export default initTooltips;
