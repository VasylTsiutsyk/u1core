// scroll-to-lenis.js

import Lenis from 'lenis';

/**
 * Ініціалізує Lenis (якщо ще не ініціалізований) і додає скрол до елементів
 * за тригером data-scroll-to="id" або href="#id".
 */
export function initScrollToEl({
  lenis, // опціонально: існуючий інстанс Lenis
  selector = '[data-scroll-to]', // тригери
  headerSelector = '.header', // фіксований хедер (для відступу зверху)
  defaultDuration = 1.0, // сек
  allowHashLinks = true, // реагувати і на <a href="#id">
} = {}) {
  // 1) Lenis instance
  const _lenis = ensureLenis(lenis);

  // 2) helper-и
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const getHeaderHeight = () => {
    const h = document.querySelector(headerSelector);
    if (!h) return 0;
    const r = h.getBoundingClientRect();
    // якщо хедер fixed/sticky — використовуємо його висоту
    return r.height || 0;
  };

  const getTargetFromTrigger = el => {
    // data-scroll-to має пріоритет
    let id = el.getAttribute('data-scroll-to');
    if (!id && allowHashLinks && el.matches('a[href*="#"]')) {
      const url = new URL(el.getAttribute('href'), location.href);
      // працюємо лише для якорів в межах цієї ж сторінки
      if (url.pathname === location.pathname && url.hash)
        id = url.hash.slice(1);
      else return null;
    }
    if (!id) return null;
    // дозволяємо як "someId", так і "#someId"
    if (id.startsWith('#')) id = id.slice(1);
    return document.getElementById(id);
  };

  const parseNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const easing = t =>
    t < 0.5
      ? 4 * t * t * t // easeInOutCubic
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const scrollToTarget = (triggerEl, targetEl) => {
    const dataOffset = parseNumber(triggerEl?.dataset.scrollOffset, 0);
    const dataDuration = parseNumber(
      triggerEl?.dataset.scrollDuration,
      defaultDuration
    );

    const offset = -getHeaderHeight() + dataOffset;
    const duration = prefersReduced ? 0 : dataDuration;

    _lenis.scrollTo(targetEl, { offset, duration, easing });
  };

  // 3) делегування кліку
  document.addEventListener(
    'click',
    e => {
      const t = e.target.closest(
        selector + (allowHashLinks ? ', a[href^="#"]' : '')
      );
      if (!t) return;

      // дати можливість відкрити у новій вкладці/копіювати адресу
      if (
        t.tagName === 'A' &&
        (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      )
        return;

      const target = getTargetFromTrigger(t);
      if (!target) return;

      e.preventDefault();
      scrollToTarget(t, target);
    },
    { passive: false }
  );

  // 4) прокрутити до хеша при завантаженні сторінки
  if (location.hash) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) {
      // дати макеті час на лейаут
      requestAnimationFrame(() =>
        _lenis.scrollTo(el, {
          offset: -getHeaderHeight(),
          duration: prefersReduced ? 0 : defaultDuration,
          easing,
        })
      );
    }
  }
}

/** Створює Lenis, якщо ще не існує; запускає RAF-петлю один раз. */
function ensureLenis(existing) {
  if (existing) return existing;
  if (window.__lenis) return window.__lenis;

  const lenis = new Lenis({
    smoothWheel: true,
    smoothTouch: false,
    // інше за потреби…
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  window.__lenis = lenis;
  return lenis;
}
