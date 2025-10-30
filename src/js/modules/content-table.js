function initTOCItem(root) {
  const scopeSel = root.dataset.tocScope || 'body';
  const headingsSel = root.dataset.tocHeadings || 'h3';
  const activeClass = root.dataset.tocActiveClass || '_active';
  const offset = parseInt(root.dataset.tocOffset || '0', 10);

  const list = root.querySelector('[data-toc-list]');
  if (!list) return;

  const scope = document.querySelector(scopeSel);
  if (!scope) return;

  // 0) колекція заголовків
  const headings = Array.from(scope.querySelectorAll(headingsSel)).filter(
    h => h.id
  );
  if (!headings.length) return;

  const headingIds = new Set(headings.map(h => h.id));

  // 1) БІЛЬШ НЕ СТВОРЮЄМО ЛІНКИ — беремо вже наявні
  //    Підійдуть як [data-toc-link], так і звичайні <a href="#id">
  const anchors = Array.from(
    list.querySelectorAll('[data-toc-link], a[href^="#"]')
  );

  const linkMap = new Map(); // id -> <a>
  for (const a of anchors) {
    const selector = a.getAttribute('data-target') || a.getAttribute('href');
    if (!selector || !selector.startsWith('#')) continue;
    const id = decodeURIComponent(selector.slice(1));
    if (!headingIds.has(id)) continue; // ігноруємо лінки без відповідного заголовка
    linkMap.set(id, a);
    // гарантуємо наявність атрибуту для делегації кліків
    if (!a.hasAttribute('data-toc-link')) a.setAttribute('data-toc-link', '');
  }

  if (!linkMap.size) return;

  // 2) single indicator
  let indicator = list.querySelector('.toc-indicator');
  if (!indicator) {
    indicator = document.createElement('span');
    indicator.className = 'toc-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    list.appendChild(indicator);
  }

  // move indicator to link
  let raf = 0;
  const moveIndicatorToLink = link => {
    if (!link) return;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const lr = link.getBoundingClientRect();
      const pr = list.getBoundingClientRect();
      const y = lr.top - pr.top + list.scrollTop;
      indicator.style.setProperty('--y', `${y}px`);
      indicator.style.setProperty('--h', `${lr.height}px`);
    });
  };

  // UI state
  const setActiveUI = id => {
    linkMap.forEach((link, key) => {
      const isActive = key === id;
      link.classList.toggle(activeClass, isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
        moveIndicatorToLink(link);
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  // smooth scroll (native)
  const smoothScrollToId = id => {
    const el = document.getElementById(id);
    if (!el) return;
    const top =
      el.getBoundingClientRect().top + window.pageYOffset - offset - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // —— LOCK проти «ступінчастості» під час скролу
  let lockId = null;
  let lockTimer = 0;
  const armLock = id => {
    lockId = id;
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => (lockId = null), 2000);
    if ('onscrollend' in window) {
      const fn = () => {
        lockId = null;
        window.removeEventListener('scrollend', fn);
      };
      window.addEventListener('scrollend', fn, { once: true });
    }
  };

  // 3) clicks (делегуємо: і [data-toc-link], і звич. <a href="#...">)
  root.addEventListener('click', e => {
    const a = e.target.closest('[data-toc-link], a[href^="#"]');
    if (!a || !list.contains(a)) return;
    const selector = a.getAttribute('data-target') || a.getAttribute('href');
    if (!selector || !selector.startsWith('#')) return;

    e.preventDefault();
    const id = decodeURIComponent(selector.slice(1));
    if (!linkMap.has(id)) return;
    armLock(id);
    setActiveUI(id);
    smoothScrollToId(id);
  });

  // 4) IO — активний пункт (ігноруємо, поки є lockId; пропускаємо заголовки без лінка)
  const io = new IntersectionObserver(
    entries => {
      let best = null;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!best || entry.intersectionRatio > best.intersectionRatio)
          best = entry;
      }
      if (!best) return;

      const id = best.target.id;
      if (!linkMap.has(id)) return; // тільки ті, що присутні в меню
      if (lockId && id !== lockId) return;
      setActiveUI(id);
      if (lockId && id === lockId) lockId = null;
    },
    {
      root: null,
      rootMargin: `${-(offset + 8)}px 0px -70% 0px`,
      threshold: [0.1, 0.25, 0.5, 0.75, 1],
    }
  );

  // Спостерігаємо всі наявні заголовки (або можна звузити лише до тих, що у linkMap)
  headings.forEach(h => io.observe(h));

  // 5) initial
  const initialId = location.hash && decodeURIComponent(location.hash.slice(1));
  const firstLinkedId = linkMap.keys().next().value || headings[0].id;

  if (
    initialId &&
    document.getElementById(initialId) &&
    linkMap.has(initialId)
  ) {
    setTimeout(() => {
      setActiveUI(initialId);
      smoothScrollToId(initialId);
    }, 0);
  } else {
    setActiveUI(firstLinkedId);
    moveIndicatorToLink(linkMap.get(firstLinkedId));
  }

  // 6) resize
  const onResize = () => {
    const current =
      list.querySelector(`[data-toc-link].${activeClass}`) ||
      list.querySelector('[data-toc-link][aria-current="true"]');
    if (current) moveIndicatorToLink(current);
  };
  window.addEventListener('resize', onResize, { passive: true });
}

function init() {
  const list = document.querySelectorAll('[data-toc]');
  if (!list) return;
  [...list].forEach(initTOCItem);
}
export default init;
