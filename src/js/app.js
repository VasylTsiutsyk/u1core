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
import initTOC from './modules/content-table';
import { initBeforeAfter } from './modules/before-after';
import initAsideVideo from './modules/aside-video';
import Modal from './modules/modal';
import initTooltips from './modules/tooltip';
import { initFooterBottomSphere } from './modules/scroll-sphere';

document.addEventListener('DOMContentLoaded', () => {
  // IS WEBP TEST
  isWebp();

  // IS MOBILE TEST
  isMobile();

  // HEADER MOBILE MENU
  initMenu();

  // ACCORDIONS
  initAccordions('.accordion', {
    showOnlyOne: true,
    closeOnClickOutside: true,
  });

  // SPOILERS
  initSpoilers();

  // SLIDERS
  initSliders();

  // LENIS (Smooth Scrolling)
  initLenisInstances();

  // FancyBox
  // import { initFancyboxes } './modules/fancybox';
  // initFancyboxes();

  // ANIMATIONS
  initAosAnimations();
  initGSAPAnimations();

  // HEADER SCROLLED STATE
  initHeader({
    selector: '.header',
    isScrolled: true,
    isHidden: true,
  });

  // Aside Video
  initAsideVideo();

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

  // Post Content Table
  initTOC();

  // Before-After Slider
  initBeforeAfter();

  // MODALS
  new Modal();

  // Tooltip
  initTooltips();

  // Scroll To Top Sphere
  initFooterBottomSphere();

  SELECTORS.BODY.classList.add(CLASSES.LOADED);
});
