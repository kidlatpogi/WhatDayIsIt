import React from 'react';
import { AppConfig } from '../../../../types';
import { Calendar, Play, BookOpen, ExternalLink, ShieldCheck, Sliders } from 'lucide-react';

interface DashboardTabProps {
  config: AppConfig | null;
  onOpenCalendar: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  config,
  onOpenCalendar,
  onNavigateTab
}) => {
  const icalCount = config?.icals?.length || 0;
  const currentFont = config?.ui?.fontFamily || 'Segoe UI';
  const displayDays = config?.ui?.displayDays || 7;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Showcase Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-md cursor-target transition-colors duration-200"
        style={{
          backgroundColor: 'var(--menu-surface)',
          border: '1px solid var(--menu-card-border)'
        }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C44900]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2
              className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans"
              style={{ color: 'var(--menu-text-primary)' }}
            >
              Desktop Timeline Overlay
            </h2>

            <p
              className="text-xs md:text-sm leading-relaxed"
              style={{ color: 'var(--menu-text-secondary)' }}
            >
              Ambient, lightweight desktop calendar widget synchronized directly with Google Calendar. Zero external cloud servers, minimal memory footprint, and live customization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={onOpenCalendar}
              className="btn-accent px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-target cursor-pointer shadow-lg"
            >
              <Play size={14} className="fill-current" />
              <span>Launch Widget</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('tutorial')}
              className="btn-surface px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-target cursor-pointer"
            >
              <BookOpen size={14} />
              <span>Integration Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Feeds Status */}
        <div
          onClick={() => onNavigateTab('calendars')}
          className="card-surface rounded-2xl p-5 hover:border-[#C44900]/60 transition-all cursor-target cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="badge-mono" style={{ color: 'var(--menu-text-muted)' }}>
              01 / FEEDS
            </span>
            <div className="p-2 rounded-lg bg-[#C44900]/10 text-[#E86711] group-hover:scale-110 transition-transform">
              <Calendar size={18} />
            </div>
          </div>

          <div>
            <div
              className="text-3xl font-black font-mono tracking-tight mb-1"
              style={{ color: 'var(--menu-text-primary)' }}
            >
              {String(icalCount).padStart(2, '0')}
            </div>
            <h3
              className="text-sm font-semibold group-hover:text-[#E86711] transition-colors"
              style={{ color: 'var(--menu-text-primary)' }}
            >
              Connected Calendars
            </h3>
            <p className="text-xs mt-1" style={{ color: 'var(--menu-text-muted)' }}>
              {icalCount === 0
                ? 'No iCal feeds configured. Click to add your Google Calendar link.'
                : `${icalCount} active calendar feed${icalCount > 1 ? 's' : ''} syncing locally.`}
            </p>
          </div>

          <div
            className="mt-4 pt-3 flex items-center justify-between text-[11px]"
            style={{
              borderTop: '1px solid var(--menu-divider)',
              color: 'var(--menu-text-secondary)'
            }}
          >
            <span>Manage Feeds</span>
            <ExternalLink size={12} />
          </div>
        </div>

        {/* Card 2: Theme Settings */}
        <div
          onClick={() => onNavigateTab('settings')}
          className="card-surface rounded-2xl p-5 hover:border-[#C44900]/60 transition-all cursor-target cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="badge-mono" style={{ color: 'var(--menu-text-muted)' }}>
              02 / THEME
            </span>
            <div className="p-2 rounded-lg bg-[#C44900]/10 text-[#E86711] group-hover:scale-110 transition-transform">
              <Sliders size={18} />
            </div>
          </div>

          <div>
            <div
              className="text-sm font-mono mb-1 px-2.5 py-1 rounded inline-block"
              style={{
                backgroundColor: 'var(--menu-input-bg)',
                color: 'var(--menu-text-primary)'
              }}
            >
              {currentFont} • {displayDays} Days
            </div>
            <h3
              className="text-sm font-semibold group-hover:text-[#E86711] transition-colors"
              style={{ color: 'var(--menu-text-primary)' }}
            >
              Customization Engine
            </h3>
            <p className="text-xs mt-1" style={{ color: 'var(--menu-text-muted)' }}>
              Tailor fonts, live colors, digital clock formats, and task completion behaviors in real-time.
            </p>
          </div>

          <div
            className="mt-4 pt-3 flex items-center justify-between text-[11px]"
            style={{
              borderTop: '1px solid var(--menu-divider)',
              color: 'var(--menu-text-secondary)'
            }}
          >
            <span>Open Customizer</span>
            <ExternalLink size={12} />
          </div>
        </div>

        {/* Card 3: Privacy & Security */}
        <div
          onClick={() => onNavigateTab('privacy')}
          className="card-surface rounded-2xl p-5 hover:border-[#C44900]/60 transition-all cursor-target cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="badge-mono" style={{ color: 'var(--menu-text-muted)' }}>
              03 / PRIVACY
            </span>
            <div className="p-2 rounded-lg bg-[#C44900]/10 text-[#E86711] group-hover:scale-110 transition-transform">
              <ShieldCheck size={18} />
            </div>
          </div>

          <div>
            <div className="text-xs font-mono text-[#E86711] mb-1 font-semibold">
              100% LOCAL ARCHITECTURE
            </div>
            <h3
              className="text-sm font-semibold group-hover:text-[#E86711] transition-colors"
              style={{ color: 'var(--menu-text-primary)' }}
            >
              Zero Telemetry & Tracking
            </h3>
            <p className="text-xs mt-1" style={{ color: 'var(--menu-text-muted)' }}>
              All events are parsed and stored on your machine. No telemetry or analytics.
            </p>
          </div>

          <div
            className="mt-4 pt-3 flex items-center justify-between text-[11px]"
            style={{
              borderTop: '1px solid var(--menu-divider)',
              color: 'var(--menu-text-secondary)'
            }}
          >
            <span>Security Details</span>
            <ExternalLink size={12} />
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Cheatsheet - NO ICON */}
      <div className="card-surface rounded-2xl p-5">
        <div className="pb-3 mb-3 border-b" style={{ borderColor: 'var(--menu-divider)' }}>
          <h4
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--menu-text-primary)' }}
          >
            Keyboard Shortcuts & Quick Actions
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div
            className="flex items-center justify-between p-2.5 rounded-lg cursor-target"
            style={{
              backgroundColor: 'var(--menu-input-bg)',
              border: '1px solid var(--menu-surface-border)'
            }}
          >
            <span style={{ color: 'var(--menu-text-secondary)' }}>
              Toggle Buttons (Collapse Timeline)
            </span>
            <kbd
              className="px-2 py-0.5 rounded font-mono text-[11px]"
              style={{
                backgroundColor: 'var(--menu-surface)',
                color: 'var(--menu-text-primary)',
                border: '1px solid var(--menu-surface-border)'
              }}
            >
              Ctrl + Shift + M
            </kbd>
          </div>

          <div
            className="flex items-center justify-between p-2.5 rounded-lg cursor-target"
            style={{
              backgroundColor: 'var(--menu-input-bg)',
              border: '1px solid var(--menu-surface-border)'
            }}
          >
            <span style={{ color: 'var(--menu-text-secondary)' }}>
              Toggle Click-Through Mode
            </span>
            <kbd
              className="px-2 py-0.5 rounded font-mono text-[11px]"
              style={{
                backgroundColor: 'var(--menu-surface)',
                color: 'var(--menu-text-primary)',
                border: '1px solid var(--menu-surface-border)'
              }}
            >
              Ctrl + Shift + C
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
