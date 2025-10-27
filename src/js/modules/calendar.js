// calendar.js
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

const REGISTRY = new WeakMap();

/** Перевіряє, що елемент видимий і має ненульову ширину */
function hasLayout(el) {
  if (!el || !el.isConnected) return false;
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  return (
    rect.width > 0 && style.display !== 'none' && style.visibility !== 'hidden'
  );
}

/** Створює (або повертає) інстанс календаря для елемента */
function getCalendar(el) {
  let rec = REGISTRY.get(el);

  if (!rec) {
    const calendar = new Calendar(el, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: el.dataset.initialView || 'dayGridMonth',
      headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next',
      },
      fixedWeekCount: true,
    });

    rec = {
      calendar,
      rendered: false,
    };

    REGISTRY.set(el, rec);
  }
  return rec;
}

/** Рендер або оновлення розміру (безпечні виклики) */
function renderOrUpdate(el) {
  const rec = getCalendar(el);

  if (!rec.rendered) {
    rec.calendar.render();
    rec.rendered = true;
  } else {
    rec.calendar.updateSize();
  }
}

/** Підписки, щоб відкласти рендер до появи розміру */
function attachVisibilityHooks(el) {
  // 1) Як тільки зʼявиться ширина — рендеримо
  const ro = new ResizeObserver(entries => {
    const w = entries[0].contentRect.width;

    if (w > 0) {
      ro.disconnect();
      // дочекатися завершення можливого transition
      requestAnimationFrame(() => renderOrUpdate(el));
    }
  });

  ro.observe(el);

  // 2) Типові події відкриття модалок
  const host = el.closest('[data-modal], .modal, [role="dialog"], dialog');
  const onShown = () => {
    // після відкриття (і CSS-анімації) — рендер
    setTimeout(() => renderOrUpdate(el), 0);
  };

  if (host) {
    host.addEventListener('modal:shown', onShown, { once: true }); // кастомна
    host.addEventListener('transitionend', onShown, { once: true }); // загальний випадок
    host.addEventListener('animationend', onShown, { once: true });
  }

  // 3) На випадок зміни вікна — підправити розмір
  const onWinResize = () => {
    const rec = REGISTRY.get(el);
    if (rec?.rendered) rec.calendar.updateSize();
  };

  window.addEventListener('resize', onWinResize, { passive: true });

  // 4) При видаленні елемента — чистимо
  const mo = new MutationObserver(() => {
    if (!el.isConnected) {
      try {
        ro.disconnect();
      } catch {}
      window.removeEventListener('resize', onWinResize);
      mo.disconnect();
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
}

function initCalendars() {
  const calendars = document.querySelectorAll('[data-calendar]');
  if (!calendars.length) return;

  calendars.forEach(calendarEl => {
    // створюємо інстанс один раз
    getCalendar(calendarEl);

    if (hasLayout(calendarEl)) {
      // якщо вже видимий — одразу рендеримо
      renderOrUpdate(calendarEl);
    } else {
      // інакше — чекаємо, поки модалка відкриється/зʼявиться розмір
      attachVisibilityHooks(calendarEl);
    }
  });
}

export default initCalendars;
