// js/modules/fancybox.js

// DOC: https://fancyapps.com/fancybox
// HTML: [data-fancybox]
// npm i --save @fancyapps/ui

import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

function initFancyboxes() {
  Fancybox.bind('[data-fancybox]', {});

  Fancybox.bind('[data-fancybox-shorts]', {
    Html: {
      videoRatio: 9 / 16,
    },
  });
}

export default initFancyboxes;
