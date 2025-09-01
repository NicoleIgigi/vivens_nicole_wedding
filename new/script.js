// Theme handling: blush (default) and black (dark)
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function applyTheme(theme) {
  if (!theme || theme === 'blush') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
  try { localStorage.setItem('wedding_theme', theme); } catch (_) {}
}

const stored = (() => { try { return localStorage.getItem('wedding_theme'); } catch (_) { return null; } })();
if (stored) {
  applyTheme(stored);
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'black';
    applyTheme(isDark ? 'blush' : 'black');
  });
}

// Countdown logic: counts down to event; after event, counts up since
(function initCountdown(){
  const container = document.getElementById('countdown');
  if (!container) return;
  const daysEl = container.querySelector('[data-days]');
  const hoursEl = container.querySelector('[data-hours]');
  const minutesEl = container.querySelector('[data-minutes]');
  const secondsEl = container.querySelector('[data-seconds]');
  const noteEl = container.querySelector('[data-note]');
  const dateAttr = container.getAttribute('data-event-datetime');
  const eventDate = new Date(dateAttr || Date.now());

  function format(num){ return String(Math.max(0, Math.floor(num))).padStart(2,'0'); }

  let lastPhase = null; // 'before' | 'after'

  function tick(){
    const now = new Date();
    let diffMs = eventDate - now;
    let phase = 'before';
    if (diffMs <= 0) { phase = 'after'; diffMs = now - eventDate; }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = format(days);
    hoursEl.textContent = format(hours);
    minutesEl.textContent = format(minutes);
    secondsEl.textContent = format(seconds);

    if (phase !== lastPhase){
      if (phase === 'before') {
        noteEl.textContent = 'Countdown to our special day';
      } else {
        noteEl.textContent = 'Happily married! Time since our wedding';
      }
      lastPhase = phase;
    }
  }

  tick();
  setInterval(tick, 1000);
})();

// Simple Add to Calendar: generates an ICS file on click
document.querySelectorAll('.add-cal').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const title = btn.getAttribute('data-title') || 'Wedding Event';
    const location = btn.getAttribute('data-location') || '';

    // Build a multi-event calendar entry when available
    const maybeMulti = btn.getAttribute('data-multi');
    let events = [];
    if (maybeMulti === 'day') {
      events = [
        { s: '2025-11-09T09:00:00', e: '2025-11-09T12:00:00', t: 'Gusaba (Intro)' },
        { s: '2025-11-09T15:00:00', e: '2025-11-09T16:30:00', t: 'Church Ceremony' },
        { s: '2025-11-09T17:00:00', e: '2025-11-09T17:20:00', t: 'Photo Session' },
        { s: '2025-11-09T17:30:00', e: '2025-11-09T22:30:00', t: 'Reception' },
      ];
    } else {
      const start = new Date(btn.getAttribute('data-start'));
      const end = new Date(btn.getAttribute('data-end') || start.getTime() + 60*60*1000);
      events = [{ s: start, e: end, t: title }];
    }

    function toICSDate(d){
      const pad = (n)=>String(n).padStart(2,'0');
      const yyyy=d.getUTCFullYear();
      const mm=pad(d.getUTCMonth()+1);
      const dd=pad(d.getUTCDate());
      const hh=pad(d.getUTCHours());
      const mi=pad(d.getUTCMinutes());
      const ss=pad(d.getUTCSeconds());
      return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
    }

    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nicole & Vivens Wedding//EN'
    ];
    events.forEach((ev) => {
      const s = ev.s instanceof Date ? ev.s : new Date(ev.s);
      const e = ev.e instanceof Date ? ev.e : new Date(ev.e);
      icsLines.push('BEGIN:VEVENT');
      icsLines.push(`DTSTART:${toICSDate(s)}`);
      icsLines.push(`DTEND:${toICSDate(e)}`);
      icsLines.push(`SUMMARY:${ev.t}`);
      if (location) icsLines.push(`LOCATION:${location}`);
      icsLines.push('END:VEVENT');
    });
    icsLines.push('END:VCALENDAR');
    const ics = icsLines.join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${title.replace(/[^a-z0-9]+/gi,'-')}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  });
});

