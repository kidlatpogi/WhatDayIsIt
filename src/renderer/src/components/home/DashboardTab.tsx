import React from 'react';
import { AppConfig } from '../../../../types';
import { Play, BookOpen, ExternalLink, Calendar, Sliders, ShieldCheck } from 'lucide-react';

interface DashboardTabProps {
  config: AppConfig | null;
  onOpenCalendar: () => void;
  onRefresh: () => void;
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
  const interval = config?.ui?.fetchInterval || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Showcase Landing Card */}
      <section
        aria-label="Overview Hero Banner"
        className="relative overflow-hidden rounded-3xl p-8 md:p-10 shadow-lg cursor-target transition-all duration-300"
        style={{
          backgroundColor: 'var(--menu-surface)',
          border: '1px solid var(--menu-card-border)'
        }}
      >
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#C44900]/12 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans leading-tight"
              style={{ color: 'var(--menu-text-primary)' }}
            >
              Desktop Timeline Overlay
            </h2>

            <p
              className="text-xs md:text-sm leading-relaxed"
              style={{ color: 'var(--menu-text-secondary)' }}
            >
              Ambient, lightweight desktop calendar widget synchronized directly with Google Calendar via RFC 5545 iCal feeds. 100% client-side execution, minimal RAM footprint, and instant live customization.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono" style={{ color: 'var(--menu-text-muted)' }}>
              <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                RFC 5545 Protocol
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                Zero Cloud Proxy
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                Windows DWM Alpha Blending
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={onOpenCalendar}
              aria-label="Launch Calendar Widget"
              className="btn-accent px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2.5 cursor-target cursor-pointer shadow-xl"
            >
              <Play size={14} className="fill-current" />
              <span className="font-bold">Launch Widget</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('tutorial')}
              aria-label="View Integration Guide"
              className="btn-surface px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-target cursor-pointer"
            >
              <BookOpen size={14} />
              <span>Integration Guide</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Matrix */}
      <section aria-label="Feature Bento Matrix" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Feeds Status */}
        <div
          onClick={() => onNavigateTab('calendars')}
          className="card-surface rounded-2xl p-6 hover:border-[#C44900]/60 transition-all cursor-target cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="badge-mono text-[10px]" style={{ color: 'var(--menu-text-muted)' }}>
              01 / FEEDS
            </span>
            <div className="p-2.5 rounded-xl bg-[#C44900]/10 text-[#E86711] group-hover:scale-110 transition-transform">
              <Calendar size={18} />
            </div>
          </div>

          <div>
            <div
              className="text-4xl font-black font-mono tracking-tight mb-1"
              style={{ color: 'var(--menu-text-primary)' }}
            >
              {String(icalCount).padStart(2, '0')}
            </div>
            <h3
              className="text-sm font-bold group-hover:text-[#E86711] transition-colors"
              style={{ color: 'var(--menu-text-primary)' }}
            >
              Connected Calendars
            </h3>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--menu-text-muted)' }}>
              {icalCount === 0
                ? 'No iCal feeds configured. Click to connect your private Google Calendar link.'
                : `${icalCount} active feed${icalCount > 1 ? 's' : ''} auto-refreshing every ${interval} min.`}
            </p>
          </div>

          <div
            className="mt-5 pt-3.5 flex items-center justify-between text-[11px] font-semibold"
            style={{
              borderTop: '1px solid var(--menu-divider)',
              color: 'var(--menu-text-secondary)'
            }}
          >
            <span>Manage Feeds</span>
            <ExternalLink size={13} />
          </div>
        </div>

        {/* Card 2: Theme Settings */}
        <div
          onClick={() => onNavigateTab('settings')}
          className="card-surface rounded-2xl p-6 hover:border-[#C44900]/60 transition-all cursor-target cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="badge-mono text-[10px]" style={{ color: 'var(--menu-text-muted)' }}>
              02 / THEME
            </span>
            <div className="p-2.5 rounded-xl bg-[#C44900]/10 text-[#E86711] group-hover:scale-110 transition-transform">
              <Sliders size={18} />
            </div>
          </div>

          <div>
            <div
              className="text-xs font-mono mb-2 px-2.5 py-1 rounded inline-block font-semibold"
              style={{
                backgroundColor: 'var(--menu-input-bg)',
                color: 'var(--menu-text-primary)',
                border: '1px solid var(--menu-surface-border)'
              }}
            >
              {currentFont} • {displayDays} Days Window
            </div>
            <h3
              className="text-sm font-bold group-hover:text-[#E86711] transition-colors"
              style={{ color: 'var(--menu-text-primary)' }}
            >
              Customization Engine
            </h3>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--menu-text-muted)' }}>
              Tailor fonts, live colors, digital clock formats, and task completion behaviors in real-time.
            </p>
          </div>

          <div
            className="mt-5 pt-3.5 flex items-center justify-between text-[11px] font-semibold"
            style={{
              borderTop: '1px solid var(--menu-divider)',
              color: 'var(--menu-text-secondary)'
            }}
          >
            <span>Open Customizer</span>
            <ExternalLink size={13} />
          </div>
        </div>

        {/* Card 3: Privacy & Security */}
        <div
          onClick={() => onNavigateTab('privacy')}
          className="card-surface rounded-2xl p-6 hover:border-[#C44900]/60 transition-all cursor-target cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="badge-mono text-[10px]" style={{ color: 'var(--menu-text-muted)' }}>
              03 / PRIVACY
            </span>
            <div className="p-2.5 rounded-xl bg-[#C44900]/10 text-[#E86711] group-hover:scale-110 transition-transform">
              <ShieldCheck size={18} />
            </div>
          </div>

          <div>
            <div className="text-xs font-mono text-[#E86711] mb-2 font-semibold tracking-wide">
              100% LOCAL ARCHITECTURE
            </div>
            <h3
              className="text-sm font-bold group-hover:text-[#E86711] transition-colors"
              style={{ color: 'var(--menu-text-primary)' }}
            >
              Zero Telemetry & Tracking
            </h3>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--menu-text-muted)' }}>
              All calendar data is parsed and stored solely on your machine. Zero behavioral analytics or telemetry beacons.
            </p>
          </div>

          <div
            className="mt-5 pt-3.5 flex items-center justify-between text-[11px] font-semibold"
            style={{
              borderTop: '1px solid var(--menu-divider)',
              color: 'var(--menu-text-secondary)'
            }}
          >
            <span>Security Architecture</span>
            <ExternalLink size={13} />
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts Cheatsheet - Clean Minimal Box */}
      <section
        aria-label="Keyboard Shortcuts Cheatsheet"
        className="card-surface rounded-2xl p-6 transition-colors duration-200"
      >
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
            className="flex items-center justify-between p-3 rounded-xl cursor-target"
            style={{
              backgroundColor: 'var(--menu-input-bg)',
              border: '1px solid var(--menu-surface-border)'
            }}
          >
            <span style={{ color: 'var(--menu-text-secondary)' }}>
              Toggle Buttons (Collapse Timeline)
            </span>
            <kbd
              className="px-2 py-1 rounded font-mono text-[11px] font-semibold"
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
            className="flex items-center justify-between p-3 rounded-xl cursor-target"
            style={{
              backgroundColor: 'var(--menu-input-bg)',
              border: '1px solid var(--menu-surface-border)'
            }}
          >
            <span style={{ color: 'var(--menu-text-secondary)' }}>
              Toggle Click-Through Mode
            </span>
            <kbd
              className="px-2 py-1 rounded font-mono text-[11px] font-semibold"
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
      </section>
    </div>
  );
};
