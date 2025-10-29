function initTOCItem(root) {
  const scopeSel = root.dataset.tocScope || 'body';
  const headingsSel = root.dataset.tocHeadings || 'h3';
  const activeClass = root.dataset.tocActiveClass || '_active';
  const offset = parseInt(root.dataset.tocOffset || '0', 10);

  const list = root.querySelector('[data-toc-list]');
  if (!list) return;

  const scope = document.querySelector(scopeSel);
  if (!scope) return;

  const headings = Array.from(scope.querySelectorAll(headingsSel)).filter(
    h => h.id
  );
  list.innerHTML = '';

  // 1) build list
  const linkMap = new Map(); // id -> <a>
  for (const h of headings) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${encodeURIComponent(h.id)}`;
    a.textContent = h.textContent.trim();
    a.setAttribute('data-toc-link', '');
    a.setAttribute('data-target', `#${h.id}`);
    li.appendChild(a);
    list.appendChild(li);
    linkMap.set(h.id, a);
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
    lockTimer = setTimeout(() => (lockId = null), 2000); // фолбек на випадок довгого скролу
    // якщо є підтримка scrollend — розлочимо автоматично
    if ('onscrollend' in window) {
      const fn = () => {
        lockId = null;
        window.removeEventListener('scrollend', fn);
      };
      window.addEventListener('scrollend', fn, { once: true });
    }
  };

  // 3) clicks
  root.addEventListener('click', e => {
    const a = e.target.closest('[data-toc-link]');
    if (!a) return;
    const selector = a.getAttribute('data-target') || a.getAttribute('href');
    if (!selector || !selector.startsWith('#')) return;

    e.preventDefault();
    const id = decodeURIComponent(selector.slice(1));
    armLock(id); // <— фіксуємось на цілі
    setActiveUI(id); // одразу переносимо індикатор до цілі
    smoothScrollToId(id); // і скролимо туди
  });

  // 4) IO — активний пункт (ігноруємо, поки є lockId і це не наша ціль)
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
      if (lockId && id !== lockId) return; // ігнор проміжних заголовків
      setActiveUI(id);
      if (lockId && id === lockId) lockId = null; // ціль досягнена — розлочити
    },
    {
      root: null,
      rootMargin: `${-(offset + 8)}px 0px -70% 0px`,
      threshold: [0.1, 0.25, 0.5, 0.75, 1],
    }
  );

  headings.forEach(h => io.observe(h));

  // 5) initial
  const initialId = location.hash && decodeURIComponent(location.hash.slice(1));
  if (initialId && document.getElementById(initialId)) {
    setTimeout(() => {
      setActiveUI(initialId);
      smoothScrollToId(initialId);
    }, 0);
  } else {
    const firstId = headings[0].id;
    setActiveUI(firstId);
    moveIndicatorToLink(linkMap.get(firstId));
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
