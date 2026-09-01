import http from 'http';
import https from 'https';
import crypto from 'crypto';
import { CalendarEvent, ICalEntry } from '../types';
import { ConfigManager } from './config-manager';
import { BrowserWindow } from 'electron';

export class IcalService {
  private cfgManager: ConfigManager;
  private _cachedEvents: CalendarEvent[] = [];
  private _pollingTimer: NodeJS.Timeout | null = null;
  public mainWindow: BrowserWindow | null = null;
  public homeWindow: BrowserWindow | null = null;

  constructor(cfgManager: ConfigManager) {
    this.cfgManager = cfgManager;
  }

  public getCachedEvents(): CalendarEvent[] {
    return this._cachedEvents;
  }

  public async fetchEvents(forceRefresh = false): Promise<CalendarEvent[]> {
    if (this._cachedEvents.length > 0 && !forceRefresh) {
      // Trigger background update silently and return cached immediately
      this.refreshAllCalendars().catch(() => {});
      return this._cachedEvents;
    }
    return this.refreshAllCalendars();
  }

  public async refreshAllCalendars(): Promise<CalendarEvent[]> {
    const cfg = this.cfgManager.config;
    const icals = (cfg.icals || [])
      .map(i => (typeof i === 'string' ? { url: i } : i || {}))
      .filter(i => (i.url || '').trim() !== '');

    if (icals.length === 0) {
      this._cachedEvents = [];
      return [];
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    const configuredDays = Number(cfg.ui?.displayDays) || 14;
    const daysAhead = Math.max(1, Math.min(30, configuredDays));
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysAhead);
    futureDate.setHours(23, 59, 59, 999);

    const allEvents: CalendarEvent[] = [];
    const eventIds = new Set<string>();

    for (const entry of icals) {
      try {
        const url = (entry.url || '').trim();
        if (!url) continue;

        const headers: Record<string, string> = {};
        if (entry.etag) headers['If-None-Match'] = entry.etag;
        if (entry.lastModified) headers['If-Modified-Since'] = entry.lastModified;

        const res = await this.fetchText(url, headers);
        if (res.status === 304 || !res.body) {
          continue;
        }

        if (res.body && typeof res.body === 'string') {
          const events = this.parseIcal(res.body);

          for (const ev of events) {
            const start = ev.start?.date || ev.start?.dateTime;
            if (!start) continue;
            const startDate = new Date(start);
            const eventDay = new Date(startDate);
            eventDay.setHours(0, 0, 0, 0);

            if (eventDay < today || eventDay > futureDate) continue;

            const eventId = `${ev.summary || ''}|${start}`;
            if (!eventIds.has(eventId)) {
              eventIds.add(eventId);
              allEvents.push(ev);
            }
          }

          // Update entry metadata
          if (res.etag) entry.etag = res.etag;
          if (res.lastModified) entry.lastModified = res.lastModified;
          entry._lastChecked = Date.now();
        }
      } catch {
        // ignore fetch/parse errors silently
      }
    }

    this._cachedEvents = allEvents;
    this.cfgManager.saveConfig();
    return allEvents;
  }

  public fetchText(url: string, headers: Record<string, string> = {}, timeout = 10000): Promise<{ status: number; body?: string; etag?: string | null; lastModified?: string | null }> {
    return new Promise((resolve, reject) => {
      try {
        const u = new URL(url);
        const lib = u.protocol === 'https:' ? https : http;
        const opts = {
          headers: {
            'User-Agent': 'ScheduleWidget/1.1',
            'Accept': 'text/calendar, */*',
            ...headers
          },
          timeout
        };

        const req = lib.get(u, opts, (res) => {
          if (res.statusCode === 304) {
            res.resume();
            return resolve({ status: 304 });
          }

          let body = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => { body += chunk; });
          res.on('end', () => {
            const etag = res.headers['etag'] || null;
            const lastModified = res.headers['last-modified'] || null;

            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ status: res.statusCode, body, etag, lastModified });
            } else {
              reject(new Error(`HTTP ${res.statusCode}`));
            }
          });
        });

        req.on('error', (err) => reject(err));
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('timeout'));
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  public parseIcal(icsText: string): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    try {
      const eventMatches = icsText.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];
      for (const eventBlock of eventMatches) {
        if (/^STATUS:CANCELLED$/im.test(eventBlock)) continue;

        const event: CalendarEvent = {
          summary: 'No title',
          start: {}
        };

        const summaryMatch = eventBlock.match(/SUMMARY:(.+?)(?:\r?\n|$)/);
        if (summaryMatch) {
          event.summary = summaryMatch[1].trim();
        }

        const dtStartMatch = eventBlock.match(/DTSTART(?:;[^:]*)?:(.+?)(?:\r?\n|$)/);
        if (dtStartMatch) {
          const dtStr = dtStartMatch[1].trim();
          if (dtStr.includes('T')) {
            event.start = { dateTime: this.parseIcalDateTime(dtStr) };
          } else {
            event.start = { date: this.formatIcalDate(dtStr) };
          }
        }

        const dtEndMatch = eventBlock.match(/DTEND(?:;[^:]*)?:(.+?)(?:\r?\n|$)/);
        if (dtEndMatch) {
          const dtStr = dtEndMatch[1].trim();
          if (dtStr.includes('T')) {
            event.end = { dateTime: this.parseIcalDateTime(dtStr) };
          } else {
            event.end = { date: this.formatIcalDate(dtStr) };
          }
        }

        const exdateMatches = Array.from(eventBlock.matchAll(/EXDATE(?:;[^:]*)?:(.+?)(?:\r?\n|$)/g)) || [];
        const exdates = new Set<string>();
        for (const m of exdateMatches) {
          if (m && m[1]) {
            const raw = m[1].trim().replace(/Z$/, '');
            for (const part of raw.split(',')) {
              exdates.add(part.trim());
            }
          }
        }

        const rruleMatch = eventBlock.match(/RRULE:(.+?)(?:\r?\n|$)/);
        if (rruleMatch && (event.start.dateTime || event.start.date)) {
          const expandedEvents = this.expandRecurringEvent(event, rruleMatch[1].trim());
          if (exdates.size > 0) {
            const filtered = expandedEvents.filter(ev => {
              const s = ev.start.dateTime || ev.start.date;
              if (!s) return true;
              const normalized = s.replace(/Z$/, '');
              return !exdates.has(normalized) && !exdates.has(normalized.split('T')[0]);
            });
            events.push(...filtered);
          } else {
            events.push(...expandedEvents);
          }
        } else {
          if ((event.summary && event.summary !== 'No title') || event.start.date || event.start.dateTime) {
            events.push(event);
          }
        }
      }
    } catch {
      // ignore
    }
    return events;
  }

  public expandRecurringEvent(baseEvent: CalendarEvent, rruleStr: string): CalendarEvent[] {
    const expanded: CalendarEvent[] = [];
    try {
      const rruleParts: Record<string, string> = {};
      rruleStr.split(';').forEach(part => {
        const [key, value] = part.split('=');
        if (key && value) rruleParts[key] = value;
      });

      const freq = rruleParts['FREQ'];
      const count = parseInt(rruleParts['COUNT'] || '14', 10) || 14;
      const interval = parseInt(rruleParts['INTERVAL'] || '1', 10) || 1;

      if (!freq || (!baseEvent.start.dateTime && !baseEvent.start.date)) return [baseEvent];

      const startStr = (baseEvent.start.dateTime || baseEvent.start.date)!;
      const baseDate = new Date(startStr);
      if (isNaN(baseDate.getTime())) return [baseEvent];

      let duration = 0;
      if (baseEvent.end) {
        const endStr = baseEvent.end.dateTime || baseEvent.end.date;
        if (endStr) {
          const endDate = new Date(endStr);
          if (!isNaN(endDate.getTime())) {
            duration = endDate.getTime() - baseDate.getTime();
          }
        }
      }

      const maxOccurrences = Math.min(count, 14);
      for (let i = 0; i < maxOccurrences; i++) {
        const occurrenceDate = new Date(baseDate);

        if (freq === 'DAILY') {
          occurrenceDate.setDate(baseDate.getDate() + (i * interval));
        } else if (freq === 'WEEKLY') {
          occurrenceDate.setDate(baseDate.getDate() + (i * interval * 7));
        } else if (freq === 'MONTHLY') {
          occurrenceDate.setMonth(baseDate.getMonth() + (i * interval));
        } else if (freq === 'YEARLY') {
          occurrenceDate.setFullYear(baseDate.getFullYear() + (i * interval));
        } else {
          return [baseEvent];
        }

        const occurrence: CalendarEvent = {
          summary: baseEvent.summary,
          start: {}
        };

        if (baseEvent.start.dateTime) {
          const y = occurrenceDate.getFullYear();
          const m = String(occurrenceDate.getMonth() + 1).padStart(2, '0');
          const d = String(occurrenceDate.getDate()).padStart(2, '0');
          const hh = String(occurrenceDate.getHours()).padStart(2, '0');
          const mm = String(occurrenceDate.getMinutes()).padStart(2, '0');
          const ss = String(occurrenceDate.getSeconds()).padStart(2, '0');
          occurrence.start = { dateTime: `${y}-${m}-${d}T${hh}:${mm}:${ss}` };

          if (duration > 0) {
            const endDate = new Date(occurrenceDate.getTime() + duration);
            const ey = endDate.getFullYear();
            const em = String(endDate.getMonth() + 1).padStart(2, '0');
            const ed = String(endDate.getDate()).padStart(2, '0');
            const ehh = String(endDate.getHours()).padStart(2, '0');
            const emm = String(endDate.getMinutes()).padStart(2, '0');
            const ess = String(endDate.getSeconds()).padStart(2, '0');
            occurrence.end = { dateTime: `${ey}-${em}-${ed}T${ehh}:${emm}:${ess}` };
          }
        } else {
          const y = occurrenceDate.getFullYear();
          const m = String(occurrenceDate.getMonth() + 1).padStart(2, '0');
          const d = String(occurrenceDate.getDate()).padStart(2, '0');
          occurrence.start = { date: `${y}-${m}-${d}` };

          if (duration > 0) {
            const endDate = new Date(occurrenceDate.getTime() + duration);
            const ey = endDate.getFullYear();
            const em = String(endDate.getMonth() + 1).padStart(2, '0');
            const ed = String(endDate.getDate()).padStart(2, '0');
            occurrence.end = { date: `${ey}-${em}-${ed}` };
          }
        }

        expanded.push(occurrence);
      }
    } catch {
      return [baseEvent];
    }
    return expanded.length > 0 ? expanded : [baseEvent];
  }

  private formatIcalDate(dateStr: string): string {
    if (!dateStr || dateStr.length < 8) return dateStr;
    const y = dateStr.substring(0, 4);
    const m = dateStr.substring(4, 6);
    const d = dateStr.substring(6, 8);
    return `${y}-${m}-${d}`;
  }

  private parseIcalDateTime(dtStr: string): string {
    try {
      const cleanStr = dtStr.replace(/Z$/, '');
      if (cleanStr.length === 8) {
        return `${cleanStr.substring(0, 4)}-${cleanStr.substring(4, 6)}-${cleanStr.substring(6, 8)}T00:00:00`;
      }
      if (cleanStr.includes('T')) {
        const [date, time] = cleanStr.split('T');
        const y = date.substring(0, 4);
        const m = date.substring(4, 6);
        const d = date.substring(6, 8);
        const hh = time.substring(0, 2) || '00';
        const mm = time.substring(2, 4) || '00';
        const ss = time.substring(4, 6) || '00';
        return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
      }
    } catch {
      // ignore
    }
    return dtStr;
  }

  public startPolling(intervalMinutes = 1): void {
    this.stopPolling();
    const intervalMs = Math.max(1, intervalMinutes) * 60 * 1000;
    this.refreshAllCalendars().catch(() => {});
    this._pollingTimer = setInterval(() => {
      this.refreshAllCalendars().then(() => {
        this.notifyWindowsRefresh();
      }).catch(() => {});
    }, intervalMs);
  }

  public stopPolling(): void {
    if (this._pollingTimer) {
      clearInterval(this._pollingTimer);
      this._pollingTimer = null;
    }
  }

  public notifyWindowsRefresh(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('refresh-events');
    }
    if (this.homeWindow && !this.homeWindow.isDestroyed()) {
      this.homeWindow.webContents.send('refresh-events');
    }
  }
}
