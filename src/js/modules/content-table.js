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
  const linkMap = new Map();
  for (const h of headings) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${encodeURIComponent(h.id)}`;
    a.textContent = h.textContent.trim();
    a.setAttribute('data-toc-link', '');
    a.setAttribute('data-target', `#${h.id}`);
    a.setAttribute('role', 'link');
    li.appendChild(a);
    list.appendChild(li);
    linkMap.set(h.id, a);
  }

  function smoothScrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;

    const top =
      el.getBoundingClientRect().top + window.pageYOffset - offset - 100;

    window.history.replaceState(null, '', `#${encodeURIComponent(id)}`);
    window.scrollTo({ top, behavior: 'smooth' });
  }

  root.addEventListener('click', e => {
    const a = e.target.closest('[data-toc-link]');
    if (!a) return;

    const selector = a.getAttribute('data-target') || a.getAttribute('href');
    if (!selector || !selector.startsWith('#')) return;

    e.preventDefault();

    const id = decodeURIComponent(selector.slice(1));
    smoothScrollToId(id);
  });

  const observer = new IntersectionObserver(
    entries => {
      // беремо найвидиміший або найближчий до top
      let best = null;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!best || entry.intersectionRatio > best.intersectionRatio) {
          best = entry;
        }
      }
      if (!best) return;
      const id = best.target.id;
      // оновити активний стан
      linkMap.forEach(link => {
        link.classList.toggle(activeClass, linkMap.get(id) === link);
        if (linkMap.get(id) === link) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    },
    {
      root: null,
      // верхній офсет (мінус — щоб активувати трохи раніше), нижній запас
      rootMargin: `${-(offset + 8)}px 0px -70% 0px`,
      threshold: [0.1, 0.25, 0.5, 0.75, 1],
    }
  );

  headings.forEach(h => observer.observe(h));

  if (location.hash) {
    const id = decodeURIComponent(location.hash.slice(1));
    if (document.getElementById(id)) {
      setTimeout(() => smoothScrollToId(id), 0);
    }
  }
}

function init() {
  const list = document.querySelectorAll('[data-toc]');
  if (!list) return;

  [...list].forEach(initTOCItem);
}

export default init;
