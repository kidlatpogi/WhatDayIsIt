import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { useEvents } from '../../hooks/useEvents';
import { DayGroup } from './DayGroup';
import { Controls } from './Controls';
import { formatLocalDateKey, parseEventDateObj } from '../../utils/date';
import { CalendarEvent } from '../../../../types';

export const WidgetView: React.FC = () => {
  const { config, ui, saveConfig } = useConfig();
  const { events, loading, error, refreshEvents } = useEvents();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.shiftKey) return;

      if (e.key === 'M' || e.key === 'm' || e.code === 'KeyM') {
        e.preventDefault();
        window.electronAPI?.toggleCollapse();
      } else if (e.key === 'C' || e.key === 'c' || e.code === 'KeyC') {
        e.preventDefault();
        setToastMessage('Ctrl+Shift+C: Click-through toggled');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show toast when collapsed
  useEffect(() => {
    if (ui.collapsed) {
      setToastMessage('Ctrl+Shift+M to uncollapse');
    }
  }, [ui.collapsed]);

  // Toast timer
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 2200);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Click-through temporary disable on button hover
  useEffect(() => {
    if (!ui.clickThrough) return;

    const handleMouseEnter = () => {
      window.electronAPI?.setClickThrough('main', false);
    };
    const handleMouseLeave = () => {
      window.electronAPI?.setClickThrough('main', true);
    };

    const interactiveElements = document.querySelectorAll('button, input, select, a');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  });

  // Custom window drag handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      // Only drag on primary click and not on interactive buttons
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('button, input, select, a, .no-drag-region')) return;

      isDragging = true;
      startX = e.screenX;
      startY = e.screenY;
      try {
        container.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.screenX - startX;
      const dy = e.screenY - startY;
      if (dx === 0 && dy === 0) return;

      startX = e.screenX;
      startY = e.screenY;
      window.electronAPI?.moveWindowBy(dx, dy);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  // Toggle event completed state
  const handleToggleComplete = async (eventId: string) => {
    if (!config) return;
    const completed = { ...(config.completedEvents || {}) };
    if (completed[eventId]) {
      delete completed[eventId];
    } else {
      completed[eventId] = true;
    }
    await saveConfig({ completedEvents: completed });
  };

  // Group events by day
  const groupedDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = formatLocalDateKey(today);

    const eventMap: Record<string, CalendarEvent[]> = {};

    for (const ev of events) {
      const start = parseEventDateObj(ev.start || {});
      if (!start || isNaN(start.getTime())) continue;

      const evDate = new Date(start);
      evDate.setHours(0, 0, 0, 0);
      if (evDate < today) continue;

      const key = formatLocalDateKey(start);
      if (!eventMap[key]) eventMap[key] = [];
      eventMap[key].push(ev);
    }

    // Sort events inside each day
    Object.keys(eventMap).forEach((key) => {
      eventMap[key].sort((a, b) => {
        const timeA = parseEventDateObj(a.start || {})?.getTime() || 0;
        const timeB = parseEventDateObj(b.start || {})?.getTime() || 0;
        return timeA - timeB;
      });
    });

    const displayDays = Math.max(1, Math.min(30, Number(ui.displayDays) || 7));
    const showEmptyDays = ui.showEmptyDays !== false;
    const daysWithEvents = new Set(Object.keys(eventMap));
    daysWithEvents.add(todayKey);

    const result: { date: Date; isToday: boolean; events: CalendarEvent[] }[] = [];

    for (let i = 0; i < displayDays; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const key = formatLocalDateKey(d);

      if (showEmptyDays || daysWithEvents.has(key)) {
        result.push({
          date: d,
          isToday: key === todayKey,
          events: eventMap[key] || []
        });
      }
    }

    return result;
  }, [events, ui.displayDays, ui.showEmptyDays]);

  const handleOpenHome = () => {
    window.electronAPI?.openHome();
  };

  return (
    <div
      ref={containerRef}
      id="app"
      className={`min-w-[340px] max-w-[500px] p-3 text-white select-none flex flex-col cursor-default drag-region ${
        ui.collapsed ? 'collapsed' : ''
      }`}
    >
      <div id="drag-handle" className="flex flex-col">
        {loading && events.length === 0 ? (
          <div className="text-sm text-white/60 py-2">Loading events...</div>
        ) : error && events.length === 0 ? (
          <div className="text-sm text-red-400 py-2">Error: {error}</div>
        ) : groupedDays.length === 0 ? (
          <div className="text-sm text-white/60 italic py-2">No events scheduled</div>
        ) : (
          <div id="list" className="flex flex-col">
            {groupedDays.map((day) => (
              <DayGroup
                key={formatLocalDateKey(day.date)}
                date={day.date}
                isToday={day.isToday}
                events={day.events}
                ui={ui}
                completedEvents={config?.completedEvents || {}}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}

        {!ui.collapsed && (
          <Controls
            onOpenHome={handleOpenHome}
            onRefresh={refreshEvents}
            isRefreshing={loading}
          />
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-4 left-3 z-50 px-3 py-1.5 bg-black/85 text-white text-xs rounded-lg shadow-lg border border-white/10 animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
