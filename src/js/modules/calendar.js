import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

function initCalendars() {
  const calendars = document.querySelectorAll('[data-calendar]');
  if (!calendars.length) return;

  [...calendars].forEach(calendarEl => {
    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next',
      },
    });

    calendar.render();
  });
}

export default initCalendars;
