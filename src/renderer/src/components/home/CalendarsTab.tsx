import React, { useState } from 'react';
import { ICalEntry } from '../../../../types';
import { Calendar, Plus, Trash2, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface CalendarsTabProps {
  icals: ICalEntry[];
  onAddIcal: (url: string) => Promise<void>;
  onDeleteIcal: (url: string) => Promise<void>;
}

export const CalendarsTab: React.FC<CalendarsTabProps> = ({
  icals,
  onAddIcal,
  onDeleteIcal
}) => {
  const [url, setUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setFeedback({ message: 'Please enter a valid iCal feed URL.', type: 'error' });
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setFeedback({ message: 'URL must start with https:// or http://', type: 'error' });
      return;
    }

    try {
      setIsAdding(true);
      await onAddIcal(cleanUrl);
      setUrl('');
      setFeedback({ message: 'Calendar feed added successfully! Synchronized locally.', type: 'success' });
      setTimeout(() => setFeedback(null), 3500);
    } catch (e: any) {
      setFeedback({ message: 'Failed to add calendar: ' + (e?.message || 'Unknown error'), type: 'error' });
    } finally {
      setIsAdding(false);
    }
  };

  const handleOpenTutorial = async () => {
    try {
      await window.electronAPI?.openTutorial();
    } catch {
      alert('Unable to open tutorial PDF.');
    }
  };

  const getMaskedLabel = (entryUrl: string, idx: number) => {
    try {
      const u = new URL(entryUrl);
      const parts = u.pathname.split('/').filter(Boolean);
      const last = parts.length > 0 ? parts[parts.length - 1] : '';
      return `${u.hostname}${last ? ' / ' + last : ''} (${idx + 1})`;
    } catch {
      return entryUrl.length > 50 ? entryUrl.slice(0, 30) + '...' + entryUrl.slice(-12) : entryUrl;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Add Calendar Box */}
      <div
        className="card-surface rounded-2xl p-6 space-y-4 cursor-target transition-colors duration-200"
        style={{
          backgroundColor: 'var(--menu-surface)',
          border: '1px solid var(--menu-card-border)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#C44900]/15 text-[#E86711]">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--menu-text-primary)' }}>
                Add Google Calendar Feed
              </h3>
              <p className="text-xs" style={{ color: 'var(--menu-text-muted)' }}>
                Paste your secret or public iCal (.ics) URL
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenTutorial}
            className="flex items-center gap-1.5 text-xs text-[#E86711] hover:text-[#FF9436] transition-colors cursor-target cursor-pointer font-semibold"
          >
            <HelpCircle size={14} />
            <span>How to find iCal link?</span>
          </button>
        </div>

        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://calendar.google.com/calendar/ical/..."
            className="flex-1 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#C44900] transition-colors font-mono cursor-target"
            style={{
              backgroundColor: 'var(--menu-input-bg)',
              border: '1px solid var(--menu-input-border)',
              color: 'var(--menu-text-primary)'
            }}
          />

          <button
            type="submit"
            disabled={isAdding}
            className="btn-accent px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-target cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <Plus size={14} />
            <span>{isAdding ? 'Adding...' : 'Add Feed'}</span>
          </button>
        </form>

        {feedback && (
          <div
            className={`flex items-center gap-2 text-xs p-3 rounded-lg border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                : 'bg-red-500/10 text-red-500 border-red-500/20'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Connected Feeds List */}
      <div
        className="card-surface rounded-2xl p-6 space-y-4 cursor-target transition-colors duration-200"
        style={{
          backgroundColor: 'var(--menu-surface)',
          border: '1px solid var(--menu-card-border)'
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--menu-divider)' }}>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#E86711]" />
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--menu-text-primary)' }}>
              Connected Calendars ({icals.length})
            </h3>
          </div>
          <span className="badge-mono" style={{ color: 'var(--menu-text-muted)' }}>
            RFC 5545 SYNC
          </span>
        </div>

        {icals.length === 0 ? (
          <div className="py-8 text-center text-xs space-y-1" style={{ color: 'var(--menu-text-muted)' }}>
            <p>No calendar feeds currently added.</p>
            <p className="text-[11px]">
              Add your Google Calendar URL above to display upcoming events.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {icals.map((ical, idx) => {
              const lastChecked = ical._lastChecked
                ? new Date(ical._lastChecked).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                : 'Active';

              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl gap-3 transition-colors cursor-target"
                  style={{
                    backgroundColor: 'var(--menu-input-bg)',
                    border: '1px solid var(--menu-surface-border)'
                  }}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="badge-mono text-[9px] px-1.5 py-0.5 rounded font-bold"
                        style={{
                          backgroundColor: 'var(--menu-surface)',
                          color: 'var(--menu-text-secondary)',
                          border: '1px solid var(--menu-surface-border)'
                        }}
                      >
                        FEED {idx + 1}
                      </span>
                      <span
                        className="text-xs font-semibold truncate font-mono"
                        style={{ color: 'var(--menu-text-primary)' }}
                        title={ical.url}
                      >
                        {getMaskedLabel(ical.url, idx)}
                      </span>
                    </div>

                    <div className="text-[11px] truncate font-mono" style={{ color: 'var(--menu-text-muted)' }}>
                      {ical.url}
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 sm:border-t-0"
                    style={{ borderTop: '1px solid var(--menu-divider)' }}
                  >
                    <span className="text-[10px]" style={{ color: 'var(--menu-text-muted)' }}>
                      Sync: {lastChecked}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove calendar "${getMaskedLabel(ical.url, idx)}"?`)) {
                          onDeleteIcal(ical.url);
                        }
                      }}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-target cursor-pointer"
                      title="Delete calendar feed"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
