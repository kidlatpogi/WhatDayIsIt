import React from 'react';
import { CalendarEvent, UIConfig } from '../../../../types';
import { Clock } from './Clock';
import { EventItem } from './EventItem';
import { formatLocalDateKey } from '../../utils/date';

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

  return (
    <div
      className="day-group select-none"
      style={{ marginBottom: ui.dateSpacing !== undefined ? `${ui.dateSpacing}px` : 'var(--date-spacing)' }}
    >
      {isToday && <Clock ui={ui} />}

      <div
        className={`day-header flex items-baseline font-bold mb-1 text-[length:var(--app-font-large)] rounded px-1 ${
          isToday ? 'bg-[var(--highlight-rgba)] py-0.5' : ''
        }`}
      >
        <span
          className="day-name"
          style={{ color: isToday ? 'var(--highlight-color)' : 'var(--day-color)' }}
        >
          {weekday}
        </span>
        <span
          className="date ml-2 font-normal text-[0.85em]"
          style={{ color: 'var(--date-color)' }}
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
