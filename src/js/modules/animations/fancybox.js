// js/modules/fancybox.js

import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

export function initFancyboxes() {
  Fancybox.bind('[data-fancybox]', {});
}
