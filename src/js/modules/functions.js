/* eslint-disable import/extensions */
/* eslint-disable node/no-unsupported-features/es-syntax */

import Bowser from 'bowser';
import { SELECTORS } from './constants';

// ======================== Is Webp ======================== //
function isWebp() {
  function testWebP(callback) {
    const webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height === 2);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }

  testWebP(support => {
    if (support) {
      SELECTORS.BODY.classList.add('webp');
    } else {
      SELECTORS.BODY.classList.add('no-webp');
    }
  });
}

// ======================== Is Mobile ======================== //
function isMobile() {
  const browser = Bowser.getParser(window.navigator.userAgent);
  const platform = browser.getPlatformType(true); // 'desktop' | 'mobile' | 'tablet' | 'tv' | 'wearable'

  const isTouchDevice = platform === 'mobile' || platform === 'tablet';

  // Optional: Add touch fallback for extra safety
  const hasTouchSupport =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const isTouch = isTouchDevice || hasTouchSupport;

  if (isTouch) {
    SELECTORS.BODY.classList.remove('pc');
    SELECTORS.BODY.classList.add('touch');
  } else {
    SELECTORS.BODY.classList.remove('touch');
    SELECTORS.BODY.classList.add('pc');
  }

  return isTouch;
}

// ======================== Disable / Enable Scroll ======================== //
function disableScroll() {
  const paddingOffset = `${window.innerWidth - SELECTORS.BODY.offsetWidth}px`;
  const pagePosition = window.scrollY;

  SELECTORS.BODY.style.paddingRight = paddingOffset;
  SELECTORS.BODY.classList.add('disable-scroll');
  SELECTORS.BODY.dataset.position = pagePosition;
  SELECTORS.BODY.style.top = `${-pagePosition}px`;
}

function enableScroll() {
  const pagePosition = parseInt(SELECTORS.BODY.dataset.position, 10);
  SELECTORS.BODY.style.top = 'auto';
  SELECTORS.BODY.classList.remove('disable-scroll');
  SELECTORS.BODY.style.paddingRight = '0px';
  window.scroll({ top: pagePosition, left: 0 });
  SELECTORS.BODY.removeAttribute('data-position');
}

// ======================== FLS (Full Logging System) ======================== //
function FLS(text, vars = '') {
  if (flsLogging) {
    if (flsLang[text]) {
      if (Array.isArray(vars)) {
        let i = 0;
        text = flsLang[text].replace(/@@/g, () => vars[i++]);
      } else {
        text = text.replace(text, flsLang[text].replace('@@', vars));
      }
    }
    setTimeout(() => {
      if (text.startsWith('(!)')) {
        console.warn(text.replace('(!)', ''));
      } else if (text.startsWith('(!!)')) {
        console.error(text.replace('(!!)', ''));
      } else {
        console.log(text);
      }
    }, 0);
  }
}

export { isWebp, isMobile, enableScroll, disableScroll, FLS };
