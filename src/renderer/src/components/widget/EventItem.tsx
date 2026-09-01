import React, { useState } from 'react';
import { CalendarEvent, UIConfig } from '../../../../types';
import { formatEventTime, getEventStatus } from '../../utils/date';

interface EventItemProps {
  event: CalendarEvent;
  isToday: boolean;
  dateKey: string;
  ui: UIConfig;
  isCompleted: boolean;
  onToggleComplete: (eventId: string) => void;
}

export const EventItem: React.FC<EventItemProps> = ({
  event,
  isToday,
  dateKey,
  ui,
  isCompleted,
  onToggleComplete
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const timeText = formatEventTime(event);
  const status = getEventStatus(event, isToday);
  const eventId = `${dateKey}-${event.summary}-${timeText}`;

  // If showCompletedEvents is disabled and item is completed or past, hide it
  if (ui.showCompletedEvents === false && (isCompleted || status === 'past')) {
    return null;
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!ui.enableMarkDone || ui.markDoneMethod === 'double-click') return;
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!ui.enableMarkDone || ui.markDoneMethod !== 'double-click') return;
    e.preventDefault();
    e.stopPropagation();
    onToggleComplete(eventId);
  };

  let statusClasses = '';
  let statusStyle: React.CSSProperties = {};

  if (isCompleted) {
    statusClasses = 'line-through opacity-50 cursor-pointer';
  } else if (status === 'past') {
    statusClasses = 'line-through opacity-60';
  } else if (status === 'ongoing') {
    statusClasses = 'pl-2 rounded-sm';
    statusStyle = {
      borderLeft: '4px solid var(--ongoing-color)',
      backgroundColor: 'var(--ongoing-rgba)'
    };
  } else if (status === 'future') {
    statusClasses = 'pl-2 rounded-sm';
    statusStyle = {
      borderLeft: '4px solid var(--upcoming-color)',
      backgroundColor: 'var(--upcoming-rgba)'
    };
  }

  return (
    <>
      <div
        className={`my-1 py-0.5 text-[length:var(--app-font-size)] cursor-default select-none transition-colors ${statusClasses}`}
        style={statusStyle}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
      >
        {timeText && (
          <>
            <span
              className="text-[length:var(--app-font-small)] mr-1.5 font-normal"
              style={{ color: 'var(--date-time-color)' }}
            >
              {timeText}
            </span>
            <span className="text-white/40 mr-1.5">•</span>
          </>
        )}
        <span
          className="font-medium"
          style={{ color: 'var(--schedule-color)' }}
        >
          {event.summary || 'No title'}
        </span>
      </div>

      {contextMenu && (
        <div
          className="fixed z-50 py-1 bg-neutral-900 border border-white/20 rounded shadow-xl min-w-[140px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={() => setContextMenu(null)}
        >
          <button
            className="w-full text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-colors"
            onClick={() => {
              onToggleComplete(eventId);
              setContextMenu(null);
            }}
          >
            {isCompleted ? '✓ Mark as Pending' : '✗ Mark as Done'}
          </button>
        </div>
      )}
    </>
  );
};
