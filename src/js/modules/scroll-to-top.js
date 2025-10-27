function initBackTop(btn) {
  const targetSel = btn.dataset.target;
  const root =
    (targetSel && document.querySelector(targetSel)) ||
    document.scrollingElement ||
    document.documentElement;

  const threshold = parseInt(btn.dataset.threshold || '120', 10);
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const smooth = btn.dataset.smooth !== 'false' && !prefersReduced;

  let ticking = false;

  const update = () => {
    const max = root.scrollHeight - root.clientHeight;
    const scrollTop = root.scrollTop;
    const progress = max > 0 ? scrollTop / max : 0;

    btn.style.setProperty('--p', (progress * 100).toFixed(2));

    console.log(progress);

    if (progress > 0.975) {
      btn.classList.add('_scroll-end');
    } else {
      btn.classList.remove('_scroll-end');
    }

    if (scrollTop > threshold) {
      btn.removeAttribute('hidden');
    } else {
      btn.setAttribute('hidden', '');
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  btn.addEventListener('click', () => {
    const opts = {
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    };

    if (root === document.documentElement || root === document.body) {
      window.scrollTo(opts);
    } else {
      root.scrollTo(opts);
    }
  });

  const scrollEventTarget = root === document.documentElement ? window : root;
  scrollEventTarget.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
}

export default function initScrollToTopBtns() {
  document.querySelectorAll('[data-scroll-top-btn]').forEach(initBackTop);
}
