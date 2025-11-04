function initTOCItem(root) {
  const scopeSel = root.dataset.tocScope || 'body';
  const headingsSel = root.dataset.tocHeadings || 'h2';
  const activeClass = root.dataset.tocActiveClass || '_active';
  const offset = parseInt(root.dataset.tocOffset || '0', 12);

  const list = root.querySelector('[data-toc-list]');
  if (!list) return;

  const scope = document.querySelector(scopeSel);
  if (!scope) return;

  // ——— helpers ———
  const translitMap = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'h',
    ґ: 'g',
    д: 'd',
    е: 'e',
    є: 'ye',
    ж: 'zh',
    з: 'z',
    и: 'y',
    і: 'i',
    ї: 'yi',
    й: 'i',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ь: '',
    ю: 'yu',
    я: 'ya',
    ы: 'y',
    э: 'e',
    ё: 'yo',
  };

  const translit = s =>
    String(s || '').replace(/[\u0400-\u04FF]/g, ch => {
      const low = ch.toLowerCase();
      const t = translitMap[low] ?? '';
      return ch === low ? t : t.charAt(0).toUpperCase() + t.slice(1);
    });

  const slugify = (text, fallback = 'section') => {
    let s = String(text || '').trim() || fallback;
    s = translit(s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    return s || fallback;
  };

  const makeUniqueId = base => {
    let id = base || 'section',
      i = 2;
    while (document.getElementById(id)) id = `${base}-${i++}`;
    return id;
  };

  function setHashSilently(id, replace = true) {
    const url = new URL(window.location.href);

    url.hash = id;
    history[replace ? 'replaceState' : 'pushState'](history.state, '', url);
  }

  // ——— headings: skip any with class ———
  const query = `:is(${headingsSel}):not([class])`;
  const headings = Array.from(scope.querySelectorAll(query));
  if (!headings.length) return;

  // ensure id + data-slug
  headings.forEach((h, idx) => {
    if (!h.id) {
      const base = slugify(
        h.dataset.slug || h.textContent,
        `section-${idx + 1}`
      );
      h.id = makeUniqueId(base);
      h.dataset.slug = h.id;
    } else {
      h.dataset.slug = h.id;
    }
  });

  // ——— build list ———
  list.innerHTML = '';
  const linkMap = new Map();
  for (const h of headings) {
    const id = h.id;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${encodeURIComponent(id)}`;
    a.textContent = (h.textContent || '').trim();
    a.setAttribute('data-toc-link', '');
    a.setAttribute('data-target', `#${id}`);
    a.setAttribute('role', 'link');
    li.appendChild(a);
    list.appendChild(li);
    linkMap.set(id, a);
  }

  // ——— indicator (data-attr) ———
  let indicator = list.querySelector('[data-toc-indicator]');
  if (!indicator) {
    indicator = document.createElement('span');
    indicator.setAttribute('data-toc-indicator', '');
    indicator.setAttribute('aria-hidden', 'true');
    list.appendChild(indicator);
  }

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

  const setActiveUI = id => {
    linkMap.forEach((link, key) => {
      const isActive = key === id;
      link.classList.toggle(activeClass, isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
        moveIndicatorToLink(link);
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  // smooth scroll (offset-aware or use CSS scroll-margin-top)
  function smoothScrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;

    const prefersReduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    setHashSilently(id, true);

    if (offset) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: prefersReduce ? 'auto' : 'smooth' });
    } else {
      el.scrollIntoView({
        behavior: prefersReduce ? 'auto' : 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  // clicks
  root.addEventListener('click', e => {
    const a = e.target.closest('[data-toc-link]');
    if (!a || !list.contains(a)) return;

    const selector = a.getAttribute('data-target') || a.getAttribute('href');
    if (!selector || !selector.startsWith('#')) return;

    e.preventDefault();

    const id = decodeURIComponent(selector.slice(1));
    smoothScrollToId(id);
  });

  // observer
  const observer = new IntersectionObserver(
    entries => {
      let best = null;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!best || entry.intersectionRatio > best.intersectionRatio)
          best = entry;
      }
      if (!best) return;
      const id = best.target.id;
      if (linkMap.has(id)) setActiveUI(id);
    },
    {
      root: null,
      rootMargin: `${-(offset + 8)}px 0px -70% 0px`,
      threshold: [0.1, 0.25, 0.5, 0.75, 1],
    }
  );
  headings.forEach(h => observer.observe(h));

  // indicator recalcs
  const ro = new ResizeObserver(() => {
    const current =
      list.querySelector(`[data-toc-link].${activeClass}`) ||
      list.querySelector('[data-toc-link][aria-current="location"]');
    if (current) moveIndicatorToLink(current);
  });

  ro.observe(list);

  list.addEventListener(
    'scroll',
    () => {
      const current =
        list.querySelector(`[data-toc-link].${activeClass}`) ||
        list.querySelector('[data-toc-link][aria-current="location"]');
      if (current) moveIndicatorToLink(current);
    },
    { passive: true }
  );

  document.fonts?.ready?.then(() => {
    const current =
      list.querySelector(`[data-toc-link].${activeClass}`) ||
      list.querySelector('[data-toc-link][aria-current="location"]');

    if (current) moveIndicatorToLink(current);
  });

  // initial
  const firstId = linkMap.keys().next().value;
  if (location.hash) {
    const id = decodeURIComponent(location.hash.slice(1));
    if (document.getElementById(id) && linkMap.has(id)) {
      setTimeout(() => {
        setActiveUI(id);
        moveIndicatorToLink(linkMap.get(id));
      }, 0);
    } else if (firstId) {
      setActiveUI(firstId);
      moveIndicatorToLink(linkMap.get(firstId));
    }
  } else if (firstId) {
    setActiveUI(firstId);
    moveIndicatorToLink(linkMap.get(firstId));
  }

  // optional destroy
  return () => {
    observer.disconnect();
    ro.disconnect();
    list.removeEventListener('scroll', moveIndicatorToLink);
  };
}

function init() {
  const items = document.querySelectorAll('[data-toc]');
  if (!items.length) return;

  [...items].forEach(initTOCItem);
}
export default init;
