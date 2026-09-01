import React, { useState } from 'react';
import { BookOpen, Copy, ExternalLink, FileText } from 'lucide-react';

export const TutorialTab: React.FC = () => {
  const [copiedSample, setCopiedSample] = useState(false);
  const sampleUrl = 'https://calendar.google.com/calendar/ical/your_email%40gmail.com/private-xxxxxxxx/basic.ics';

  const handleCopySample = () => {
    navigator.clipboard.writeText(sampleUrl);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2500);
  };

  const handleOpenPdf = async () => {
    try {
      await window.electronAPI?.openTutorial();
    } catch {
      alert('Unable to open tutorial PDF.');
    }
  };

  const handleOpenGoogleCalendar = () => {
    window.electronAPI?.openUrl('https://calendar.google.com/calendar/r/settings');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20 text-xs leading-relaxed">
      {/* Overview Header Banner */}
      <div
        className="card-surface rounded-2xl p-6 shadow-md cursor-target transition-colors duration-200"
        style={{
          backgroundColor: 'var(--menu-surface)',
          border: '1px solid var(--menu-card-border)'
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="badge-mono text-[#E86711] font-bold">
              INTEGRATION & USER MANUAL
            </span>
            <h2
              className="text-xl font-bold font-sans tracking-tight"
              style={{ color: 'var(--menu-text-primary)' }}
            >
              Google Calendar iCal Integration Protocol
            </h2>
            <p style={{ color: 'var(--menu-text-secondary)' }}>
              Standard Operating Procedure for extracting and synchronizing RFC 5545 feeds locally.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenGoogleCalendar}
              className="btn-accent px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-target cursor-pointer"
            >
              <ExternalLink size={13} />
              <span>Google Calendar Settings</span>
            </button>

            <button
              type="button"
              onClick={handleOpenPdf}
              className="btn-surface px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-target cursor-pointer"
            >
              <FileText size={13} />
              <span>PDF Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1-Column ATS Formatted Sections */}
      <div className="space-y-4">
        {/* Step 1 */}
        <section
          className="card-surface rounded-2xl p-6 space-y-2 cursor-target transition-colors duration-200"
          style={{
            backgroundColor: 'var(--menu-surface)',
            border: '1px solid var(--menu-card-border)'
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--menu-divider)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--menu-text-primary)' }}>
              1. Access Calendar Settings
            </h3>
            <span className="badge-mono text-[#E86711] bg-[#C44900]/10 px-2 py-0.5 rounded">
              PHASE 01
            </span>
          </div>
          <p style={{ color: 'var(--menu-text-secondary)' }}>
            Launch Google Calendar in your web browser. Navigate to the top-right header and click the <b>Settings Gear icon (⚙️)</b>, then select <b>Settings</b> from the dropdown menu.
          </p>
          <div
            className="p-3 rounded-xl font-mono text-[11px]"
            style={{
              backgroundColor: 'var(--menu-input-bg)',
              border: '1px solid var(--menu-surface-border)',
              color: 'var(--menu-text-muted)'
            }}
          >
            Direct URL: <span className="text-[#E86711]">https://calendar.google.com/calendar/r/settings</span>
          </div>
        </section>

        {/* Step 2 */}
        <section
          className="card-surface rounded-2xl p-6 space-y-2 cursor-target transition-colors duration-200"
          style={{
            backgroundColor: 'var(--menu-surface)',
            border: '1px solid var(--menu-card-border)'
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--menu-divider)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--menu-text-primary)' }}>
              2. Locate Target Calendar
            </h3>
            <span className="badge-mono text-[#E86711] bg-[#C44900]/10 px-2 py-0.5 rounded">
              PHASE 02
            </span>
          </div>
          <p style={{ color: 'var(--menu-text-secondary)' }}>
            In the left navigation sidebar under <b>&ldquo;Settings for my calendars&rdquo;</b>, click on the specific calendar whose timeline events you wish to render on your Windows desktop.
          </p>
          <p style={{ color: 'var(--menu-text-muted)' }}>
            Note: You can add multiple separate calendar feeds (e.g., Primary Work, Personal, Academic) and Calendar Widget will merge their timelines seamlessly.
          </p>
        </section>

        {/* Step 3 */}
        <section
          className="card-surface rounded-2xl p-6 space-y-3 cursor-target transition-colors duration-200"
          style={{
            backgroundColor: 'var(--menu-surface)',
            border: '1px solid var(--menu-card-border)'
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--menu-divider)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--menu-text-primary)' }}>
              3. Copy Secret Address in iCal Format (.ics)
            </h3>
            <span className="badge-mono text-[#E86711] bg-[#C44900]/10 px-2 py-0.5 rounded">
              PHASE 03
            </span>
          </div>
          <p style={{ color: 'var(--menu-text-secondary)' }}>
            Scroll down to the <b>&ldquo;Integrate calendar&rdquo;</b> panel. Locate the field titled <b>&ldquo;Secret address in iCal format&rdquo;</b> and copy the entire private HTTP URL.
          </p>

          <div
            className="p-3 rounded-xl flex items-center justify-between gap-3 font-mono text-[11px]"
            style={{
              backgroundColor: 'var(--menu-input-bg)',
              border: '1px solid var(--menu-surface-border)'
            }}
          >
            <span className="truncate text-[#E86711]">{sampleUrl}</span>
            <button
              type="button"
              onClick={handleCopySample}
              className="btn-surface px-3 py-1 rounded text-[10px] uppercase font-bold shrink-0 cursor-target cursor-pointer"
            >
              {copiedSample ? 'Copied' : 'Copy Sample'}
            </button>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--menu-text-muted)' }}>
            Security Notice: Do not share your private iCal link publicly. Calendar Widget operates 100% locally and never transfers your feed URL to third-party servers.
          </p>
        </section>

        {/* Step 4 */}
        <section
          className="card-surface rounded-2xl p-6 space-y-2 cursor-target transition-colors duration-200"
          style={{
            backgroundColor: 'var(--menu-surface)',
            border: '1px solid var(--menu-card-border)'
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--menu-divider)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--menu-text-primary)' }}>
              4. Provision Feed in Desktop Application
            </h3>
            <span className="badge-mono text-[#E86711] bg-[#C44900]/10 px-2 py-0.5 rounded">
              PHASE 04
            </span>
          </div>
          <p style={{ color: 'var(--menu-text-secondary)' }}>
            Return to this dashboard, switch to the <b>&ldquo;Calendars&rdquo;</b> tab, paste your copied URL into the feed input field, and click <b>&ldquo;Add Feed&rdquo;</b>.
          </p>
          <p className="text-[#E86711] font-semibold text-[11px]">
            ✓ Synchronization Complete: The local parser will fetch and update schedule intervals in the background.
          </p>
        </section>

        {/* Hotkeys Table */}
        <section
          className="card-surface rounded-2xl p-6 space-y-3 cursor-target transition-colors duration-200"
          style={{
            backgroundColor: 'var(--menu-surface)',
            border: '1px solid var(--menu-card-border)'
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--menu-divider)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--menu-text-primary)' }}>
              Desktop Hotkeys & Interaction Cheatsheet
            </h3>
            <span className="badge-mono" style={{ color: 'var(--menu-text-muted)' }}>
              OPERATIONS
            </span>
          </div>

          <div
            className="overflow-x-auto rounded-xl"
            style={{
              border: '1px solid var(--menu-surface-border)'
            }}
          >
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--menu-input-bg)',
                    borderBottom: '1px solid var(--menu-surface-border)'
                  }}
                >
                  <th className="p-2.5 font-bold uppercase tracking-wider" style={{ color: 'var(--menu-text-primary)' }}>
                    Action
                  </th>
                  <th className="p-2.5 font-bold uppercase tracking-wider" style={{ color: 'var(--menu-text-primary)' }}>
                    Key Combination / Gesture
                  </th>
                  <th className="p-2.5 font-bold uppercase tracking-wider" style={{ color: 'var(--menu-text-primary)' }}>
                    Behavior
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--menu-divider)' }}>
                <tr>
                  <td className="p-2.5 font-semibold" style={{ color: 'var(--menu-text-primary)' }}>Reposition Widget</td>
                  <td className="p-2.5"><span className="font-mono text-[#E86711]">Top Grip Bar / Card Space</span></td>
                  <td className="p-2.5" style={{ color: 'var(--menu-text-secondary)' }}>Click and drag anywhere on top bar to move across monitors</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold" style={{ color: 'var(--menu-text-primary)' }}>Collapse Timeline Buttons</td>
                  <td className="p-2.5"><kbd className="px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--menu-input-bg)' }}>Ctrl + Shift + M</kbd></td>
                  <td className="p-2.5" style={{ color: 'var(--menu-text-secondary)' }}>Hides Home and Refresh buttons for minimal floating UI</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold" style={{ color: 'var(--menu-text-primary)' }}>Click-Through Pass</td>
                  <td className="p-2.5"><kbd className="px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--menu-input-bg)' }}>Ctrl + Shift + C</kbd></td>
                  <td className="p-2.5" style={{ color: 'var(--menu-text-secondary)' }}>Allows mouse events to pass directly to underlying windows</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold" style={{ color: 'var(--menu-text-primary)' }}>Mark Event Completed</td>
                  <td className="p-2.5"><span className="font-mono text-[#E86711]">Right-Click / Double-Click</span></td>
                  <td className="p-2.5" style={{ color: 'var(--menu-text-secondary)' }}>Applies strikethrough styling and persists task state</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
