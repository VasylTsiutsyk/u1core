/**
 * Universal content tabs/accordion controller (data-ct only)
 * data-ct            : root instance id (string)
 * data-ct-tab        : tab id
 * data-ct-toggle     : toggle id
 * data-ct-panel      : panel id (must match tab/toggle id)
 *
 * Опції:
 * - syncHash   : реагувати на #ct=<id> (default true)
 * - singleOpen : у мобі-акордеоні відкрита тільки одна панель (default true)
 * - initialId  : примусово активувати цей id при ініціалізації (default null)
 * - onChange   : callback({ ctId, id, root })
 */
function initContentTabs(
  scope = document,
  { syncHash = true, singleOpen = true, initialId = null, onChange = null } = {}
) {
  const roots = Array.from(
    scope instanceof Element || scope instanceof Document
      ? scope.querySelectorAll('[data-ct]')
      : document.querySelectorAll('[data-ct]')
  );

  const controllers = [];

  roots.forEach(root => {
    const ctId = root.getAttribute('data-ct') || '';

    const qAll = sel => Array.from(root.querySelectorAll(sel));
    const tabs = qAll('[data-ct-tab]');
    const toggles = qAll('[data-ct-toggle]');
    const panels = qAll('[data-ct-panel]');

    // допускаємо відсутність однієї з груп (таби або тогли),
    // але якщо обидві порожні — немає чим керувати
    if (!tabs.length && !toggles.length) return;

    // швидкий доступ по id
    const byId = (arr, id) =>
      arr.find(
        el =>
          (el.dataset.ctTab ?? el.dataset.ctToggle ?? el.dataset.ctPanel) === id
      );

    function hideAll() {
      panels.forEach(p => {
        p.hidden = true;
      });
      tabs.forEach(t => {
        t.setAttribute('aria-selected', 'false');
        t.tabIndex = -1;
      });
      toggles.forEach(tg => tg.setAttribute('aria-expanded', 'false'));
    }

    function activate(id, { allowCollapse = false } = {}) {
      const panel = byId(panels, id);
      const tab = byId(tabs, id);
      const toggle = byId(toggles, id);

      const isOpen = panel && !panel.hidden;

      // акордеонне згортання (коли клікають по відкритому тоглу)
      if (allowCollapse && toggle && isOpen) {
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        if (tab) {
          tab.setAttribute('aria-selected', 'false');
          tab.tabIndex = -1;
        }
        return;
      }

      // tabs режим завжди single; для мобі — керує singleOpen
      if (tabs.length || singleOpen) {
        hideAll();
      }

      // відкрити потрібну панель
      if (panel) panel.hidden = false;

      // синхронізувати таби
      if (tab) {
        tabs.forEach(t => {
          t.setAttribute('aria-selected', 'false');
          t.tabIndex = -1;
        });
        tab.setAttribute('aria-selected', 'true');
        tab.tabIndex = 0;
      }

      // синхронізувати тогли
      if (toggle) {
        if (singleOpen)
          toggles.forEach(tg => tg.setAttribute('aria-expanded', 'false'));
        toggle.setAttribute('aria-expanded', 'true');
      }

      const detail = { ctId, id, root };
      root.dispatchEvent(new CustomEvent('ct:change', { detail }));
      if (typeof onChange === 'function') onChange(detail);
    }

    // початковий стан
    let initial =
      initialId ||
      tabs.find(t => t.getAttribute('aria-selected') === 'true')?.dataset
        .ctTab ||
      toggles.find(t => t.getAttribute('aria-expanded') === 'true')?.dataset
        .ctToggle ||
      panels.find(p => !p.hidden)?.dataset.ctPanel ||
      panels[0]?.dataset.ctPanel; // <- фолбек: перша панель

    if (initial) activate(initial);

    // делегування кліків
    root.addEventListener('click', e => {
      const tabBtn = e.target.closest('[data-ct-tab]');
      if (tabBtn && root.contains(tabBtn)) {
        e.preventDefault();
        const id = tabBtn.dataset.ctTab;
        activate(id);
        tabBtn.focus();
        return;
      }

      const toggleBtn = e.target.closest('[data-ct-toggle]');
      if (toggleBtn && root.contains(toggleBtn)) {
        e.preventDefault();
        const id = toggleBtn.dataset.ctToggle;
        activate(id, { allowCollapse: true });
        return;
      }
    });

    // клавіатура для табів (якщо вони є)
    if (tabs.length) {
      root.addEventListener('keydown', e => {
        const current = document.activeElement;
        if (!current || !current.matches('[data-ct-tab]')) return;

        const list = tabs;
        const i = list.indexOf(current);

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const next = list[(i + 1) % list.length];
          activate(next.dataset.ctTab);
          next.focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = list[(i - 1 + list.length) % list.length];
          activate(prev.dataset.ctTab);
          prev.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          const first = list[0];
          activate(first.dataset.ctTab);
          first.focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          const last = list[list.length - 1];
          activate(last.dataset.ctTab);
          last.focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
        }
      });
    }

    // deep-link через hash
    if (syncHash && location.hash.startsWith('#ct=')) {
      const id = decodeURIComponent(location.hash.slice(4));
      if (byId(panels, id)) activate(id);
    }

    controllers.push({ root, activate });
  });

  return controllers;
}

export default initContentTabs;
