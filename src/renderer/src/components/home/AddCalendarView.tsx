import React, { useState } from 'react';
import { ICalEntry } from '../../../../types';

interface AddCalendarViewProps {
  icals: ICalEntry[];
  onAddIcal: (url: string) => Promise<void>;
  onDeleteIcal: (url: string) => Promise<void>;
  onBack: () => void;
}

export const AddCalendarView: React.FC<AddCalendarViewProps> = ({
  icals,
  onAddIcal,
  onDeleteIcal,
  onBack
}) => {
  const [url, setUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleAdd = async () => {
    const clean = url.trim();
    if (!clean) {
      setStatusMsg({ text: 'Please enter a valid iCal URL', type: 'error' });
      return;
    }

    try {
      setIsAdding(true);
      await onAddIcal(clean);
      setUrl('');
      setStatusMsg({ text: '✓ Calendar added! Please refresh your calendar.', type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (e: any) {
      setStatusMsg({ text: 'Failed to add calendar: ' + e?.message, type: 'error' });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 text-white flex flex-col space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto animate-fade-in">
      <h2 className="text-base font-semibold">Add Calendar</h2>
      <p className="text-xs text-white/70">Paste your Google Calendar iCal URL:</p>

      <div className="flex flex-col space-y-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://calendar.google.com/calendar/ical/..."
          className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-400 placeholder:text-white/30"
        />

        <button
          type="button"
          onClick={handleAdd}
          disabled={isAdding}
          className="w-full py-2 px-4 rounded-lg text-xs font-semibold btn-primary cursor-pointer disabled:opacity-50"
        >
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </div>

      {statusMsg && (
        <div
          className={`text-xs font-medium text-center ${
            statusMsg.type === 'success' ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Your Calendars */}
      <div className="border-t border-white/10 pt-3 mt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
          Your Calendars:
        </h3>

        {icals.length === 0 ? (
          <p className="text-xs text-white/40 italic">No calendars added yet</p>
        ) : (
          <div className="space-y-2">
            {icals.map((ical, index) => {
              const dateAdded = ical._lastChecked
                ? new Date(ical._lastChecked).toLocaleDateString()
                : 'Active';

              return (
                <div
                  key={index}
                  className="bg-black/30 p-2.5 rounded-lg border border-white/5 flex flex-col space-y-1.5 text-xs"
                >
                  <div className="break-all text-white/80 font-mono text-[11px]">
                    <span className="font-semibold text-white/90">URL:</span>{' '}
                    {ical.url.length > 55 ? ical.url.substring(0, 55) + '...' : ical.url}
                  </div>
                  <div className="text-[10px] text-white/50">
                    <span className="font-semibold">Last Checked:</span> {dateAdded}
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this calendar?')) {
                          onDeleteIcal(ical.url);
                        }
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium bg-red-500/20 text-red-300 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors"
                    >
                      Delete Calendar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
