/* eslint-disable import/extensions */
/* eslint-disable node/no-unsupported-features/es-syntax */

import { SELECTORS, CLASSES } from './modules/constants';
import { isWebp, isMobile } from './modules/functions';
import { initMenu, initHeader } from './modules/menu';
import initSelects from './modules/selects';
import initCopyright from './modules/copyright';
import initScrollToTopBtns from './modules/scroll-to-top';
import initProjectTypeCards from './modules/project-card';
import initAccordions from './modules/accordion';
import initSliders from './modules/sliders';
import { showMore } from './modules/show-more';
import initCalendars from './modules/calendar';
import { initAosAnimations, initGSAPAnimations } from './modules/animations';
import { initIndustryCardsFollowPreview } from './modules/industries-preview';
import { initReviewsExpand } from './modules/reviews';
import { initLenisInstances } from './modules/lenis';
import { initEfficiencyCards } from './modules/efficiency-cards';
import { initProgressRings } from './modules/progress-rings';
import initSpoilers from './modules/spoilers';
import { initSpotlightFollow } from './modules/spotlight-follow';
import { initPartnershipsMap } from './modules/partnership-map';
import initContentTabs from './modules/content-tabs';

document.addEventListener('DOMContentLoaded', () => {
  // IS WEBP TEST
  isWebp();

  // IS MOBILE TEST
  isMobile();

  // HEADER MOBILE MENU
  initMenu();

  // Copyright
  // import initCopyright from './modules/copyright';
  // initCopyright();

  // Input Password
  // import initPasswordInputs from './modules/input-password';
  // initPasswordInputs();

  // Scroll To Links (without hash)
  // import initScrollToLinks from './modules/scroll-to';
  // initScrollToLinks();

  // TIME COUNT
  // initTimeCount();

  // RANGE INPUT
  // import initRangeInputs from './modules/range';
  // initRangeInputs();

  // DYNAMIC ADAPT
  // import DynamicAdapt from './modules/dynamic-adapt';
  // new DynamicAdapt().init();

  // SELECTS
  // import initSelects from './modules/selects';
  // initSelects();

  // TABS
  // import initTabs from './modules/tabs';
  // initTabs();

  // MODALS
  // import Modal from './modules/modal';
  // new Modal();

  // GOOGLE MAPS
  // import initMaps from './modules/map';
  // initMaps();

  // ACCORDIONS
  initAccordions('.accordion', {
    showOnlyOne: true,
    closeOnClickOutside: true,
  });

  // TOGGLES
  // import initToggles from './modules/toggle';
  // initToggles();

  // SPOILERS
  // import initSpoilers from './modules/spoilers';
  initSpoilers();

  // SLIDERS
  initSliders();

  // TOOLTIPS
  // import initTooltips from './modules/tooltip';
  // initTooltips();

  // LENIS (Smooth Scrolling)
  initLenisInstances();

  // FancyBox
  // import { initFancyboxes } './modules/fancybox';
  // initFancyboxes();

  // ANIMATIONS
  initAosAnimations();
  initGSAPAnimations();

  // IMG PARALLAX
  // import initImgParallax from './modules/img-parallax';
  // initImgParallax();

  // DARK THEME
  // import initDarkTheme from './modules/dark-theme';
  // initDarkTheme();

  // HEADER SCROLLED STATE
  initHeader({
    selector: '.header',
    isScrolled: true,
    isHidden: true,
  });

  // Copyright
  initCopyright();

  // Selects
  initSelects();

  // Scroll To Top
  initScrollToTopBtns();

  initProjectTypeCards();

  // Show More
  showMore();

  // Calendars
  initCalendars();

  // Section Industries
  initIndustryCardsFollowPreview();

  // Section Reviews (Expand)
  initReviewsExpand();

  // Efficiency Card
  initEfficiencyCards();

  // Progress Rings
  initProgressRings();

  // Spotlight Follow
  initSpotlightFollow();

  // Partnerships Map
  initPartnershipsMap();

  // Content Tabs
  initContentTabs();

  SELECTORS.BODY.classList.add(CLASSES.LOADED);
});
