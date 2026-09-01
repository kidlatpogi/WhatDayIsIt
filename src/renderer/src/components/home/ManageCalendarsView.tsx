import React from 'react';
import { ICalEntry } from '../../../../types';

interface ManageCalendarsViewProps {
  icals: ICalEntry[];
  onDeleteIcal: (url: string) => Promise<void>;
  onBack: () => void;
}

export const ManageCalendarsView: React.FC<ManageCalendarsViewProps> = ({
  icals,
  onDeleteIcal,
  onBack
}) => {
  const getMaskedLabel = (url: string, index: number): string => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split('/').filter(Boolean);
      const last = parts.length > 0 ? parts[parts.length - 1] : '';
      return `${u.hostname}${last ? ' / ' + last : ''} (${index + 1})`;
    } catch {
      return url.length > 40 ? url.slice(0, 26) + '...' + url.slice(-8) : url;
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 text-white flex flex-col space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto animate-fade-in">
      <h2 className="text-base font-semibold">Manage Calendars</h2>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {icals.length === 0 ? (
          <div className="text-xs text-white/40 italic py-3 text-center">
            No calendars added
          </div>
        ) : (
          icals.map((ical, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 bg-black/30 rounded-lg border border-white/5 text-xs gap-3"
            >
              <span
                className="flex-1 truncate font-mono text-[11px] text-white/80"
                title={ical.url}
              >
                {getMaskedLabel(ical.url, idx)}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this calendar? This will remove it from the app.')) {
                    onDeleteIcal(ical.url);
                  }
                }}
                className="px-3 py-1 text-[11px] font-medium bg-white/5 border border-white/10 rounded hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 px-4 rounded-lg text-xs font-medium btn-glass text-white cursor-pointer"
        >
          Back
        </button>
      </div>
    </div>
  );
};
