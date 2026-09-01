import React, { useState, useEffect } from 'react';
import { UIConfig } from '../../../../types';
import { applyCssVariables } from '../../utils/colors';
import { Sliders, Type, Palette, Clock, CheckSquare, Sparkles, Check, Save } from 'lucide-react';

interface SettingsTabProps {
  initialUI: UIConfig;
  onSave: (settings: Partial<UIConfig>) => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ initialUI, onSave }) => {
  const [formData, setFormData] = useState<UIConfig>({ ...initialUI });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData({ ...initialUI });
  }, [initialUI]);

  // Real-time live update: updates the literal desktop calendar window in real-time
  const handleChange = (key: keyof UIConfig, value: any) => {
    const next = { ...formData, [key]: value };
    setFormData(next);
    applyCssVariables(next);

    // Broadcast live to floating desktop widget immediately
    try {
      window.electronAPI?.setConfig(next);
    } catch {
      // ignore
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e: any) {
      alert('Failed to save settings: ' + e?.message);
    } finally {
      setIsSaving(false);
    }
  };

  const fontOptions = [
    'Segoe UI',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Home Video',
    'LED Dot-Matrix'
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Sticky Save Banner */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between p-3.5 backdrop-blur-md rounded-2xl shadow-xl transition-colors duration-200"
        style={{
          backgroundColor: 'var(--menu-header-bg)',
          border: '1px solid var(--menu-card-border)'
        }}
      >
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--menu-text-secondary)' }}>
          <Sparkles size={14} className="text-[#E86711]" />
          <span>Desktop Widget Live Sync: Adjustments update your floating calendar in real-time.</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="btn-accent px-5 py-2 rounded-xl text-xs flex items-center gap-2 cursor-target cursor-pointer shadow-lg disabled:opacity-50"
        >
          {savedSuccess ? <Check size={14} /> : <Save size={14} />}
          <span>{savedSuccess ? 'Settings Saved & Synced!' : isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Card 1: Typography Engine */}
        <div
          className="card-surface rounded-2xl p-5 space-y-4 cursor-target transition-colors duration-200"
          style={{
            backgroundColor: 'var(--menu-surface)',
            border: '1px solid var(--menu-card-border)'
          }}
        >
          <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--menu-divider)' }}>
            <Type size={16} className="text-[#E86711]" />
            <h3 className="font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--menu-text-primary)' }}>
              Typography Engine
            </h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label style={{ color: 'var(--menu-text-secondary)' }}>Font Family:</label>
              <select
                value={formData.fontFamily || 'Segoe UI'}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full rounded-xl px-3 py-2 outline-none focus:border-[#C44900] cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'var(--menu-input-bg)',
                  border: '1px solid var(--menu-input-border)',
                  color: 'var(--menu-text-primary)'
                }}
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label style={{ color: 'var(--menu-text-secondary)' }}>Font Size:</label>
                <span className="font-mono font-bold" style={{ color: 'var(--menu-text-primary)' }}>
                  {formData.fontSize ?? 14}px
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="22"
                value={formData.fontSize ?? 14}
                onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                className="w-full accent-[#C44900] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Color Palette */}
        <div
          className="card-surface rounded-2xl p-5 space-y-4 cursor-target transition-colors duration-200"
          style={{
            backgroundColor: 'var(--menu-surface)',
            border: '1px solid var(--menu-card-border)'
          }}
        >
          <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--menu-divider)' }}>
            <Palette size={16} className="text-[#E86711]" />
            <h3 className="font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--menu-text-primary)' }}>
              Color Theme & Swatches
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className="flex items-center justify-between p-2.5 rounded-xl cursor-target"
              style={{
                backgroundColor: 'var(--menu-input-bg)',
                border: '1px solid var(--menu-surface-border)'
              }}
            >
              <span style={{ color: 'var(--menu-text-secondary)' }}>Event Title</span>
              <input
                type="color"
                value={formData.scheduleColor || '#ffffff'}
                onChange={(e) => handleChange('scheduleColor', e.target.value)}
                className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer"
              />
            </div>

            <div
              className="flex items-center justify-between p-2.5 rounded-xl cursor-target"
              style={{
                backgroundColor: 'var(--menu-input-bg)',
                border: '1px solid var(--menu-surface-border)'
              }}
            >
              <span style={{ color: 'var(--menu-text-secondary)' }}>Time Stamp</span>
              <input
                type="color"
                value={formData.dateTimeColor || '#cfe9ff'}
                onChange={(e) => handleChange('dateTimeColor', e.target.value)}
                className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer"
              />
            </div>

            <div
              className="flex items-center justify-between p-2.5 rounded-xl cursor-target"
              style={{
                backgroundColor: 'var(--menu-input-bg)',
                border: '1px solid var(--menu-surface-border)'
              }}
            >
              <span style={{ color: 'var(--menu-text-secondary)' }}>Highlight / Today</span>
              <input
                type="color"
                value={formData.highlightColor || '#a3ff33'}
                onChange={(e) => handleChange('highlightColor', e.target.value)}
                className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer"
              />
            </div>

            <div
              className="flex items-center justify-between p-2.5 rounded-xl cursor-target"
              style={{
                backgroundColor: 'var(--menu-input-bg)',
                border: '1px solid var(--menu-surface-border)'
              }}
            >
              <span style={{ color: 'var(--menu-text-secondary)' }}>Day Header</span>
              <input
                type="color"
                value={formData.dayColor || '#ffffff'}
                onChange={(e) => handleChange('dayColor', e.target.value)}
                className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer"
              />
            </div>

            <div
              className="flex items-center justify-between p-2.5 rounded-xl cursor-target"
              style={{
                backgroundColor: 'var(--menu-input-bg)',
                border: '1px solid var(--menu-surface-border)'
              }}
            >
              <span style={{ color: 'var(--menu-text-secondary)' }}>Date Subtext</span>
              <input
                type="color"
                value={formData.dateColor || '#cfe9ff'}
                onChange={(e) => handleChange('dateColor', e.target.value)}
                className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer"
              />
            </div>

            <div
              className="flex items-center justify-between p-2.5 rounded-xl cursor-target"
              style={{
                backgroundColor: 'var(--menu-input-bg)',
                border: '1px solid var(--menu-surface-border)'
              }}
            >
              <span style={{ color: 'var(--menu-text-secondary)' }}>Upcoming Event</span>
              <input
                type="color"
                value={formData.upcomingColor || '#a3ff33'}
                onChange={(e) => handleChange('upcomingColor', e.target.value)}
                className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Digital Clock Display */}
        <div
          className="card-surface rounded-2xl p-5 space-y-4 cursor-target transition-colors duration-200"
          style={{
            backgroundColor: 'var(--menu-surface)',
            border: '1px solid var(--menu-card-border)'
          }}
        >
          <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--menu-divider)' }}>
            <Clock size={16} className="text-[#E86711]" />
            <h3 className="font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--menu-text-primary)' }}>
              Digital Clock Header
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none cursor-target">
              <input
                type="checkbox"
                checked={formData.showClock !== false}
                onChange={(e) => handleChange('showClock', e.target.checked)}
                className="rounded accent-[#C44900] w-4 h-4 cursor-pointer"
              />
              <span style={{ color: 'var(--menu-text-primary)' }}>Show Digital Clock on Today&apos;s Card</span>
            </label>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label style={{ color: 'var(--menu-text-secondary)' }}>Clock Font:</label>
                <select
                  value={formData.clockFontFamily || 'Segoe UI'}
                  onChange={(e) => handleChange('clockFontFamily', e.target.value)}
                  className="w-full rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--menu-input-bg)',
                    border: '1px solid var(--menu-input-border)',
                    color: 'var(--menu-text-primary)'
                  }}
                >
                  {fontOptions.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label style={{ color: 'var(--menu-text-secondary)' }}>Alignment:</label>
                <select
                  value={formData.clockAlignment || 'left'}
                  onChange={(e) => handleChange('clockAlignment', e.target.value as any)}
                  className="w-full rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--menu-input-bg)',
                    border: '1px solid var(--menu-input-border)',
                    color: 'var(--menu-text-primary)'
                  }}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none cursor-target">
                <input
                  type="checkbox"
                  checked={!!formData.clock12Hour}
                  onChange={(e) => handleChange('clock12Hour', e.target.checked)}
                  className="rounded accent-[#C44900] w-4 h-4 cursor-pointer"
                />
                <span style={{ color: 'var(--menu-text-primary)' }}>12-Hour Format (AM/PM)</span>
              </label>

              <div className="flex items-center gap-2 cursor-target">
                <span style={{ color: 'var(--menu-text-secondary)' }}>Color:</span>
                <input
                  type="color"
                  value={formData.clockColor || '#ffffff'}
                  onChange={(e) => handleChange('clockColor', e.target.value)}
                  className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Layout & System Controls */}
        <div
          className="card-surface rounded-2xl p-5 space-y-4 cursor-target transition-colors duration-200"
          style={{
            backgroundColor: 'var(--menu-surface)',
            border: '1px solid var(--menu-card-border)'
          }}
        >
          <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--menu-divider)' }}>
            <Sliders size={16} className="text-[#E86711]" />
            <h3 className="font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--menu-text-primary)' }}>
              Layout & System Sync
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none cursor-target">
              <input
                type="checkbox"
                checked={!!formData.autoStart}
                onChange={(e) => handleChange('autoStart', e.target.checked)}
                className="rounded accent-[#C44900] w-4 h-4 cursor-pointer"
              />
              <span style={{ color: 'var(--menu-text-primary)' }}>Launch Widget on Windows Startup</span>
            </label>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label style={{ color: 'var(--menu-text-secondary)' }}>Days to Display:</label>
                <select
                  value={formData.displayDays || 7}
                  onChange={(e) => handleChange('displayDays', Number(e.target.value))}
                  className="w-full rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--menu-input-bg)',
                    border: '1px solid var(--menu-input-border)',
                    color: 'var(--menu-text-primary)'
                  }}
                >
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} Days
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label style={{ color: 'var(--menu-text-secondary)' }}>Sync Interval:</label>
                <select
                  value={formData.fetchInterval || 1}
                  onChange={(e) => handleChange('fetchInterval', Number(e.target.value))}
                  className="w-full rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--menu-input-bg)',
                    border: '1px solid var(--menu-input-border)',
                    color: 'var(--menu-text-primary)'
                  }}
                >
                  <option value="1">Every 1 min</option>
                  <option value="3">Every 3 mins</option>
                  <option value="5">Every 5 mins</option>
                  <option value="10">Every 10 mins</option>
                  <option value="30">Every 30 mins</option>
                  <option value="60">Every 60 mins</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between">
                <label style={{ color: 'var(--menu-text-secondary)' }}>Date Group Spacing:</label>
                <span className="font-mono font-bold" style={{ color: 'var(--menu-text-primary)' }}>
                  {formData.dateSpacing ?? 16}px
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="32"
                value={formData.dateSpacing ?? 16}
                onChange={(e) => handleChange('dateSpacing', Number(e.target.value))}
                className="w-full accent-[#C44900] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Task Management */}
        <div
          className="card-surface rounded-2xl p-5 space-y-4 md:col-span-2 cursor-target transition-colors duration-200"
          style={{
            backgroundColor: 'var(--menu-surface)',
            border: '1px solid var(--menu-card-border)'
          }}
        >
          <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--menu-divider)' }}>
            <CheckSquare size={16} className="text-[#E86711]" />
            <h3 className="font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--menu-text-primary)' }}>
              Task Automation & Done Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer select-none cursor-target">
              <input
                type="checkbox"
                checked={formData.enableMarkDone !== false}
                onChange={(e) => handleChange('enableMarkDone', e.target.checked)}
                className="rounded accent-[#C44900] w-4 h-4 cursor-pointer"
              />
              <span style={{ color: 'var(--menu-text-primary)' }}>Enable Mark as Done</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none cursor-target">
              <input
                type="checkbox"
                checked={formData.showCompletedEvents !== false}
                onChange={(e) => handleChange('showCompletedEvents', e.target.checked)}
                className="rounded accent-[#C44900] w-4 h-4 cursor-pointer"
              />
              <span style={{ color: 'var(--menu-text-primary)' }}>Show Completed (Strikethrough)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none cursor-target">
              <input
                type="checkbox"
                checked={formData.showEmptyDays !== false}
                onChange={(e) => handleChange('showEmptyDays', e.target.checked)}
                className="rounded accent-[#C44900] w-4 h-4 cursor-pointer"
              />
              <span style={{ color: 'var(--menu-text-primary)' }}>Show Days Without Events</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
