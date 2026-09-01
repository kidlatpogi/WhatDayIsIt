import { CalendarEvent } from '../../../types';

export function formatLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseEventDateObj(dtObj: { date?: string; dateTime?: string }): Date | null {
  if (!dtObj) return null;

  if (dtObj.date) {
    const parts = dtObj.date.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  }

  if (dtObj.dateTime) {
    const d = new Date(dtObj.dateTime);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
}

export function formatEventTime(ev: CalendarEvent): string {
  if (ev.start?.date) {
    return 'All day';
  }

  const s = parseEventDateObj(ev.start || {});
  if (!s || isNaN(s.getTime())) return '';

  let timeText = s.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const e = parseEventDateObj(ev.end || {});
  if (e && !isNaN(e.getTime()) && e.getTime() !== s.getTime()) {
    timeText += ' – ' + e.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  return timeText;
}

export function getEventStatus(ev: CalendarEvent, isToday: boolean): 'past' | 'ongoing' | 'future' | 'normal' {
  const now = new Date();
  const startTime = parseEventDateObj(ev.start || {});
  if (!startTime) return 'normal';

  const endTime = parseEventDateObj(ev.end || {}) || startTime;

  if (endTime < now) {
    return 'past';
  }
  if (startTime <= now && now < endTime) {
    return 'ongoing';
  }
  if (startTime > now && isToday) {
    return 'future';
  }
  return 'normal';
}
