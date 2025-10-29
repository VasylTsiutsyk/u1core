/* eslint-disable import/extensions */
/* eslint-disable node/no-unsupported-features/es-syntax */

import { SELECTORS, CLASSES } from './modules/constants';
import { isWebp, isMobile } from './modules/functions';
import { initMenu, initHeader } from './modules/menu';

import initSelects from './modules/selects';
import initCalendars from './modules/calendar';

import initCopyright from './modules/copyright';
import initAccordions from './modules/accordion';
import initSpoilers from './modules/spoilers';
import initSliders from './modules/sliders';
import initTooltips from './modules/tooltip';
import Modal from './modules/modal';
import initContentTabs from './modules/content-tabs';
import { initBeforeAfter } from './modules/before-after';
import { initScrollToEl } from './modules/scroll-to-lenis';

import initScrollToTopBtns from './modules/scroll-to-top';
import initProjectTypeCards from './modules/project-card';
import { initReviewsExpand } from './modules/reviews';
import { showMore } from './modules/show-more';
import { initReviewBadgesBlock } from './modules/review-badges-block';
import initTOC from './modules/content-table';
import initAsideVideo from './modules/aside-video';
import { initPartnershipsMap } from './modules/partnership-map';

import {
  initProgressRings,
  initVerticalSwiperScroll,
  initProjectCardFollowBtn,
  initHeroOverlap,
  initServices,
  initCurveOnScroll,
  initSpotlightFollow,
  initPinnedStacks,
  initEfficiencyCards,
  initIndustryCardsFollowPreview,
  initFooterBottomSphere,
  initAosAnimations,
  initLenisInstances,
  initFancyboxes,
  initShowreelScale,
} from './modules/animations';

document.addEventListener('DOMContentLoaded', () => {
  // IS WEBP TEST
  isWebp();

  // IS MOBILE TEST
  const IS_MOBILE = isMobile();

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

  // ANIMATIONS
  initAosAnimations();

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

  // Hero Overlap
  initHeroOverlap();

  // Showreel
  initShowreelScale();

  // Services
  initServices();

  // Project Type Cards
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

  // Fancybox
  initFancyboxes();

  // Review Badges Block
  initReviewBadgesBlock();

  // Curve Animation (Graph Lines)
  initCurveOnScroll({
    trigger: document.querySelector('.section-milestone'),
    maxBend: 360,
  });

  // Project Card Follow Btn
  initProjectCardFollowBtn();

  // Scroll To El
  initScrollToEl();

  if (!IS_MOBILE) {
    // Vertical Stack Cards (Solutions)
    initVerticalSwiperScroll();

    // Pinned Stacks
    initPinnedStacks();
  }

  SELECTORS.BODY.classList.add(CLASSES.LOADED);
});
