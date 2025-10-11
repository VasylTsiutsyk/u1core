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

let slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains('--slide')) {
    target.classList.add('--slide');
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty('height') : null;
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      !showmore ? target.style.removeProperty('overflow') : null;
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('--slide');
      // Створюємо подію
      document.dispatchEvent(
        new CustomEvent('slideUpDone', {
          detail: {
            target: target,
          },
        })
      );
    }, duration);
  }
};

let slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains('--slide')) {
    target.classList.add('--slide');
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty('height') : null;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('--slide');
      // Створюємо подію
      document.dispatchEvent(
        new CustomEvent('slideDownDone', {
          detail: {
            target: target,
          },
        })
      );
    }, duration);
  }
};

function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array)
    .filter(item => item.dataset[dataSetValue])
    .map(item => {
      const [value, type = 'max'] = item.dataset[dataSetValue].split(',');
      return { value, type, item };
    });

  if (media.length === 0) return [];

  // Отримуємо унікальні брейкпоінти
  const breakpointsArray = media.map(
    ({ value, type }) => `(${type}-width: ${value}px),${value},${type}`
  );
  const uniqueQueries = [...new Set(breakpointsArray)];

  return uniqueQueries.map(query => {
    const [mediaQuery, mediaBreakpoint, mediaType] = query.split(',');
    const matchMedia = window.matchMedia(mediaQuery);

    // Фільтруємо об'єкти з потрібними умовами
    const itemsArray = media.filter(
      item => item.value === mediaBreakpoint && item.type === mediaType
    );

    return { itemsArray, matchMedia };
  });
}

export {
  isWebp,
  isMobile,
  enableScroll,
  disableScroll,
  FLS,
  slideUp,
  slideDown,
  dataMediaQueries,
};
