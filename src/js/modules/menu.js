// ======================== Header ======================== //
import { enableScroll, disableScroll, isMobile } from './functions';
import { SELECTORS, CLASSES } from './constants';

function initMenuArrows(menu) {
  const menuArrows = menu.querySelectorAll('[data-menu-arrow]');
  if (!menuArrows.length) return;

  [...menuArrows].forEach(arrow => {
    arrow.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();

      if (arrow && arrow.parentElement) {
        arrow.parentElement.classList.toggle(CLASSES.ACTIVE);
      }
    });
  });
}

function initMenu() {
  const menu = document.querySelector('[data-menu]');
  if (!menu) return;

  const menuBtn = menu.querySelector('[data-menu-burger]');
  const menuBody = menu.querySelector('[data-menu-body]');

  const main = document.querySelector('main');

  // Optional
  const menuItems = menu.querySelectorAll('[data-menu-item]');
  const menuOverlay = menu.querySelector('[data-menu-overlay]');

  function openMobileMenu() {
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close Menu');
    menuBody.removeAttribute('inert');
    menuBody.removeAttribute('style');

    if (main) {
      main.setAttribute('inert', '');
    }

    menuBtn.classList.add(CLASSES.ACTIVE);
    menuBody.classList.add(CLASSES.ACTIVE);

    disableScroll();

    menuBtn.focus();
  }

  function closeMobileMenu() {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open Menu');
    menuBody.setAttribute('inert', '');

    if (main) {
      main.removeAttribute('inert');
    }

    menuBtn.classList.remove(CLASSES.ACTIVE);
    menuBody.classList.remove(CLASSES.ACTIVE);

    enableScroll();

    menuBtn.focus();
  }

  if (menuBtn && menuBody) {
    menuBtn.addEventListener('click', e => {
      if (!e.target.classList.contains(CLASSES.ACTIVE)) {
        openMobileMenu();
      } else {
        closeMobileMenu();
      }
    });

    if (isMobile()) {
      initMenuArrows(menuBody);
    }

    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMobileMenu);
    }

    if (menuItems && menuItems.length) {
      menuItems.forEach(() => closeMobileMenu);
    }
  }

  function setupMenu(e) {
    if (e.matches) {
      // is mobile
      menuBody.setAttribute('inert', '');
      menuBody.style.transition = 'none';
    } else {
      // is tablet/desktop
      closeMobileMenu();
      menuBody.removeAttribute('inert');
    }
  }

  // Media Request
  const media = window.matchMedia('(width < 62rem)');
  media.addEventListener('change', e => {
    setupMenu(e);
  });
}

function setHeaderHeight(headerHeight) {
  if (!headerHeight) return;

  SELECTORS.ROOT.style.setProperty('--header-height', `${headerHeight}px`);
}

function isHeaderHeightChanged(header, prevHeight) {
  const currentHeight = header.offsetHeight;
  return currentHeight !== prevHeight;
}

function initHeader(options = {}) {
  const { selector = '.header', isScrolled = true, isHidden = true } = options;

  const header = document.querySelector(selector);
  if (!header) return;

  let prevHeaderHeight = header.offsetHeight;
  let prevScrollDistance = window.scrollY;

  setHeaderHeight(prevHeaderHeight);

  window.addEventListener('scroll', () => {
    const scrollDistance = window.scrollY;

    if (isHeaderHeightChanged(header, prevHeaderHeight)) {
      prevHeaderHeight = header.offsetHeight;
      setHeaderHeight(prevHeaderHeight);
    }

    if (isScrolled) {
      if (scrollDistance >= prevHeaderHeight) {
        header.classList.add('_scrolled');
      } else {
        header.classList.remove('_scrolled');
      }
    }

    if (isHidden && prevScrollDistance > 0 && prevScrollDistance !== 0) {
      if (prevScrollDistance >= scrollDistance) {
        header.classList.remove('_hidden');
      } else {
        header.classList.add('_hidden');
      }
    }

    prevScrollDistance = scrollDistance;
  });

  window.addEventListener('resize', () => {
    if (isHeaderHeightChanged(header, prevHeaderHeight)) {
      prevHeaderHeight = header.offsetHeight;
      setHeaderHeight(prevHeaderHeight);
    }
  });
}

export { initHeader, initMenu };
