/* eslint-disable no-param-reassign */

// js/modules/spoilers.js

// ===== Spoilers ===== //
// HTML: s-spoilers

import { CLASSES } from './constants';

const SLIDE_DURATION = 500;

// slide functions
const slideUp = (target, duration = 500) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');

    target.style.transitionProperty = 'all';
    target.style.transitionDuration = `${duration}ms`;
    target.style.height = `${target.offsetHeight}px`;
    // eslint-disable-next-line no-unused-expressions
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;

    window.setTimeout(() => {
      target.hidden = true;
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-property');
      target.style.removeProperty('transition-duration');
      target.classList.remove('_slide');
    }, duration);
  }
};

const slideDown = (target, duration = 500) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');

    if (target.hidden) target.hidden = false;

    const height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    // eslint-disable-next-line no-unused-expressions
    target.offsetHeight;
    target.style.transitionProperty = 'all';
    target.style.transitionDuration = `${duration}ms`;
    target.style.height = `${height}px`;

    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');

    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-property');
      target.style.removeProperty('transition-duration');
      target.classList.remove('_slide');
    }, duration);
  }
};

const slideToggle = (target, duration = 500) =>
  target.hidden ? slideDown(target, duration) : slideUp(target, duration);

// init functions
function hideSpoilersBody(spoilersBlock) {
  const spoilerActiveTitle = spoilersBlock.querySelector(
    '[data-spoiler]._active'
  );

  if (spoilerActiveTitle) {
    spoilerActiveTitle.classList.remove(CLASSES.ACTIVE);
    slideUp(spoilerActiveTitle.nextElementSibling, 500);
  }
}

function setSpoilerAction(e) {
  const el = e.target;

  if (el.hasAttribute('data-spoiler') || el.closest('[data-spoiler]')) {
    const spoilerTitle = el.hasAttribute('data-spoiler')
      ? el
      : el.closest('[data-spoiler]');

    const spoilersBlock = spoilerTitle.closest('[data-spoilers]');
    const oneSpoiler = spoilersBlock.hasAttribute('data-one-spoiler');

    if (!spoilersBlock.querySelectorAll('_slide').length) {
      if (oneSpoiler && !spoilerTitle.classList.contains(CLASSES.ACTIVE)) {
        hideSpoilersBody(spoilersBlock);
      }

      spoilerTitle.classList.toggle(CLASSES.ACTIVE);
      slideToggle(spoilerTitle.nextElementSibling, SLIDE_DURATION);
    }

    e.preventDefault();
  }
}

function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
  const spoilerTitles = spoilersBlock.querySelectorAll('[data-spoiler]');

  if (spoilerTitles.length > 0) {
    spoilerTitles.forEach(spoilerTitle => {
      if (hideSpoilerBody) {
        spoilerTitle.removeAttribute('tabindex');

        if (!spoilerTitle.classList.contains(CLASSES.ACTIVE)) {
          spoilerTitle.nextElementSibling.hidden = true;
        }
      } else {
        spoilerTitle.setAttribute('tabindex', '-1');
        spoilerTitle.nextElementSibling.hidden = false;
      }
    });
  }
}

function initSpoilers(spoilersArr, matchMedia = false) {
  spoilersArr.forEach(s => {
    s = matchMedia ? s.item : s;

    if (matchMedia.matches || !matchMedia) {
      s.classList.add('_init');
      initSpoilerBody(s);
      s.addEventListener('click', setSpoilerAction);
    } else {
      s.classList.remove('_init');
      initSpoilerBody(s, false);
      s.removeEventListener('click', setSpoilerAction);
    }
  });
}

function init() {
  const spoilers = document.querySelectorAll('[data-spoilers]');

  if (spoilers && spoilers.length > 0) {
    const spoilersRegular = [...spoilers].filter(
      s => !s.dataset.spoilers.split(',')[0]
    );

    if (spoilersRegular.length > 0) {
      initSpoilers(spoilersRegular);
    }

    const spoilersMedia = [...spoilers].filter(
      s => s.dataset.spoilers.split(',')[0]
    );

    if (spoilersMedia.length > 0) {
      const breakpoints = [];

      spoilersMedia.forEach(s => {
        const params = s.dataset.spoilers;
        const [value, type] = params.split(',');

        const breakpoint = {
          value,
          type: type ? type.trim() : 'max',
          item: s,
        };

        breakpoints.push(breakpoint);
      });

      const mediaQueries = breakpoints
        .map(b => `(${b.type}-width: ${b.value}px), ${b.value}, ${b.type}`)
        .filter((b, idx, self) => self.indexOf(b) === idx);

      mediaQueries.forEach(m => {
        const paramsArr = m.split(',');
        const [mediaMatch, mediaBreakpoint, mediaType] = paramsArr;
        const matchMedia = window.matchMedia(mediaMatch);

        const spoilersArr = breakpoints.filter(
          b => b.value === mediaBreakpoint.trim() && b.type === mediaType.trim()
        );

        matchMedia.addEventListener('change', () => {
          initSpoilers(spoilersArr, matchMedia);
        });

        initSpoilers(spoilersArr, matchMedia);
      });
    }
  }
}

export default init;
