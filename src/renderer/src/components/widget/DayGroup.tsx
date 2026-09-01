import React from 'react';
import { CalendarEvent, UIConfig } from '../../../../types';
import { Clock } from './Clock';
import { EventItem } from './EventItem';
import { formatLocalDateKey } from '../../utils/date';
import { hexToRgba } from '../../utils/colors';

interface DayGroupProps {
  date: Date;
  isToday: boolean;
  events: CalendarEvent[];
  ui: UIConfig;
  completedEvents: Record<string, boolean>;
  onToggleComplete: (eventId: string) => void;
}

export const DayGroup: React.FC<DayGroupProps> = ({
  date,
  isToday,
  events,
  ui,
  completedEvents,
  onToggleComplete
}) => {
  const dateKey = formatLocalDateKey(date);
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
  const formattedDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const headerFontSize = ui.fontSize ? Math.max(12, Number(ui.fontSize) + 2) : undefined;

  return (
    <div
      className={`day-group select-none ${isToday ? 'is-today' : ''}`}
      style={{
        marginBottom: ui.dateSpacing !== undefined ? `${ui.dateSpacing}px` : 'var(--date-spacing)'
      }}
    >
      {isToday && <Clock ui={ui} />}

      <div
        className={`day-header flex items-baseline font-bold mb-1 rounded px-1 ${
          isToday ? 'py-0.5' : ''
        }`}
        style={{
          backgroundColor: isToday
            ? ui.highlightColor
              ? hexToRgba(ui.highlightColor, 0.15)
              : 'var(--highlight-rgba)'
            : undefined,
          fontSize: headerFontSize ? `${headerFontSize}px` : 'var(--app-font-large)'
        }}
      >
        <span
          className="day-name"
          style={{
            color: isToday
              ? ui.highlightColor || 'var(--highlight-color)'
              : ui.dayColor || 'var(--day-color)'
          }}
        >
          {weekday}
        </span>
        <span
          className="date date-subtext ml-2 font-normal text-[0.85em]"
          style={{ color: ui.dateColor || 'var(--date-color)' }}
        >
          {formattedDate}
        </span>
      </div>

      <div className="events-container pl-1">
        {events.length === 0 ? (
          <div className="text-white/50 italic text-xs py-0.5">No events</div>
        ) : (
          events.map((ev, idx) => (
            <EventItem
              key={`${dateKey}-${ev.summary}-${idx}`}
              event={ev}
              isToday={isToday}
              dateKey={dateKey}
              ui={ui}
              isCompleted={!!completedEvents[`${dateKey}-${ev.summary}-${ev.start?.date || ev.start?.dateTime}`]}
              onToggleComplete={onToggleComplete}
            />
          ))
        )}
      </div>
    </div>
  );
};
