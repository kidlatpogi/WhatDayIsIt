import React from 'react';
import { AppConfig } from '../../../../types';
import { Calendar, Play, RefreshCw, BookOpen, ExternalLink, ShieldCheck, Zap, Sliders, Layers } from 'lucide-react';

interface DashboardTabProps {
  config: AppConfig | null;
  onOpenCalendar: () => void;
  onRefresh: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  config,
  onOpenCalendar,
  onRefresh,
  onNavigateTab
}) => {
  const icalCount = config?.icals?.length || 0;
  const currentFont = config?.ui?.fontFamily || 'Segoe UI';
  const displayDays = config?.ui?.displayDays || 7;

  const handleOpenTutorial = async () => {
    try {
      await window.electronAPI?.openTutorial();
    } catch {
      alert('Unable to open tutorial PDF.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Showcase Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1b1b] to-[#141313] border border-white/10 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C44900]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="badge-mono px-2.5 py-0.5 rounded-full bg-[#C44900]/20 text-[#E86711] border border-[#C44900]/30">
                LOCAL-FIRST CALENDAR
              </span>
              <span className="badge-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Desktop Timeline Overlay
            </h2>

            <p className="text-xs md:text-sm text-white/70 leading-relaxed">
              Ambient, lightweight desktop calendar widget synchronized directly with Google Calendar. Zero external cloud servers, minimal memory footprint, and full customization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={onOpenCalendar}
              className="btn-accent px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Play size={14} className="fill-current" />
              <span>Open Calendar</span>
            </button>

            <button
              type="button"
              onClick={handleOpenTutorial}
              className="btn-surface px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer text-white/90 hover:text-white"
            >
              <BookOpen size={14} />
              <span>Tutorial Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Feeds Status */}
        <div
          onClick={() => onNavigateTab('calendars')}
          className="card-surface rounded-2xl p-5 hover:border-[#C44900]/60 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="badge-mono text-white/50">01 / FEEDS</span>
            <div className="p-2 rounded-lg bg-white/5 text-[#E86711] group-hover:scale-110 transition-transform">
              <Calendar size={18} />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black font-mono tracking-tight text-white mb-1">
              {String(icalCount).padStart(2, '0')}
            </div>
            <h3 className="text-sm font-semibold text-white/90 group-hover:text-[#E86711] transition-colors">
              Connected Calendars
            </h3>
            <p className="text-xs text-white/50 mt-1">
              {icalCount === 0
                ? 'No iCal feeds configured. Click to add your Google Calendar link.'
                : `${icalCount} active calendar feed${icalCount > 1 ? 's' : ''} syncing locally.`}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/60">
            <span>Manage Feeds</span>
            <ExternalLink size={12} />
          </div>
        </div>

        {/* Card 2: Theme Settings */}
        <div
          onClick={() => onNavigateTab('settings')}
          className="card-surface rounded-2xl p-5 hover:border-[#C44900]/60 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="badge-mono text-white/50">02 / THEME</span>
            <div className="p-2 rounded-lg bg-white/5 text-[#E86711] group-hover:scale-110 transition-transform">
              <Sliders size={18} />
            </div>
          </div>

          <div>
            <div className="text-sm font-mono text-white/90 mb-1 bg-white/5 px-2.5 py-1 rounded inline-block">
              {currentFont} • {displayDays} Days
            </div>
            <h3 className="text-sm font-semibold text-white/90 group-hover:text-[#E86711] transition-colors">
              Customization Engine
            </h3>
            <p className="text-xs text-white/50 mt-1">
              Tailor fonts, live colors, digital clock formats, and task completion behaviors.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/60">
            <span>Open Customizer</span>
            <ExternalLink size={12} />
          </div>
        </div>

        {/* Card 3: Privacy & Security */}
        <div
          onClick={() => onNavigateTab('privacy')}
          className="card-surface rounded-2xl p-5 hover:border-[#C44900]/60 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="badge-mono text-white/50">03 / PRIVACY</span>
            <div className="p-2 rounded-lg bg-white/5 text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck size={18} />
            </div>
          </div>

          <div>
            <div className="text-xs font-mono text-emerald-400 mb-1 font-semibold">
              100% LOCAL ARCHITECTURE
            </div>
            <h3 className="text-sm font-semibold text-white/90 group-hover:text-emerald-300 transition-colors">
              Zero Telemetry & Tracking
            </h3>
            <p className="text-xs text-white/50 mt-1">
              All events are parsed and stored on your machine. No telemetry or analytics.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/60">
            <span>Security Details</span>
            <ExternalLink size={12} />
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Cheatsheet */}
      <div className="card-surface rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-[#E86711]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Keyboard Shortcuts & Quick Actions
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-white/[0.02] rounded-lg border border-white/5">
            <span className="text-white/70">Toggle Buttons (Collapse Timeline)</span>
            <kbd className="px-2 py-0.5 bg-white/10 rounded font-mono text-[11px] text-white">
              Ctrl + Shift + M
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-white/[0.02] rounded-lg border border-white/5">
            <span className="text-white/70">Toggle Click-Through Mode</span>
            <kbd className="px-2 py-0.5 bg-white/10 rounded font-mono text-[11px] text-white">
              Ctrl + Shift + C
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
