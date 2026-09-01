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

  const handleChange = (key: keyof UIConfig, value: any) => {
    const next = { ...formData, [key]: value };
    setFormData(next);
    applyCssVariables(next);
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
    <div className="space-y-6 animate-fade-in text-white pb-16">
      {/* Sticky Save Banner */}
      <div className="sticky top-0 z-20 flex items-center justify-between p-3.5 bg-[#141313]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Sparkles size={14} className="text-[#E86711]" />
          <span>Adjust settings with instant live preview. Click save to persist.</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="btn-accent px-5 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
        >
          {savedSuccess ? <Check size={14} /> : <Save size={14} />}
          <span>{savedSuccess ? 'Saved!' : isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Card 1: Typography Engine */}
        <div className="card-surface rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Type size={16} className="text-[#E86711]" />
            <h3 className="font-bold uppercase tracking-wider text-xs">Typography Engine</h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-white/70">Font Family:</label>
              <select
                value={formData.fontFamily || 'Segoe UI'}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full bg-[#101010] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C44900]"
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
                <label className="text-white/70">Font Size:</label>
                <span className="font-mono text-white/90">{formData.fontSize ?? 14}px</span>
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

            {/* Live Typography Preview */}
            <div
              className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1"
              style={{
                fontFamily: formData.fontFamily ? `"${formData.fontFamily}", sans-serif` : 'var(--font-sans)',
                fontSize: `${formData.fontSize ?? 14}px`
              }}
            >
              <div className="text-white/50 text-[10px] uppercase font-sans">Live Typography Preview:</div>
              <div style={{ color: formData.dayColor || '#ffffff' }}>Tuesday, Sep 1</div>
              <div style={{ color: formData.scheduleColor || '#ffffff' }}>
                <span style={{ color: formData.dateTimeColor || '#cfe9ff' }}>10:00 AM</span> • Project Standup
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Color Palette */}
        <div className="card-surface rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Palette size={16} className="text-[#E86711]" />
            <h3 className="font-bold uppercase tracking-wider text-xs">Color Theme & Swatches</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-2.5 bg-[#101010] rounded-xl border border-white/5">
              <span className="text-white/70">Event Title</span>
              <input
                type="color"
                value={formData.scheduleColor || '#ffffff'}
                onChange={(e) => handleChange('scheduleColor', e.target.value)}
                className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#101010] rounded-xl border border-white/5">
              <span className="text-white/70">Time Stamp</span>
              <input
                type="color"
                value={formData.dateTimeColor || '#cfe9ff'}
                onChange={(e) => handleChange('dateTimeColor', e.target.value)}
                className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#101010] rounded-xl border border-white/5">
              <span className="text-white/70">Highlight / Today</span>
              <input
                type="color"
                value={formData.highlightColor || '#a3ff33'}
                onChange={(e) => handleChange('highlightColor', e.target.value)}
                className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#101010] rounded-xl border border-white/5">
              <span className="text-white/70">Day Header</span>
              <input
                type="color"
                value={formData.dayColor || '#ffffff'}
                onChange={(e) => handleChange('dayColor', e.target.value)}
                className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#101010] rounded-xl border border-white/5">
              <span className="text-white/70">Date Subtext</span>
              <input
                type="color"
                value={formData.dateColor || '#cfe9ff'}
                onChange={(e) => handleChange('dateColor', e.target.value)}
                className="w-7 h-7 bg-transparent border-0 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#101010] rounded-xl border border-white/5">
              <span className="text-white/70">Upcoming Event</span>
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
        <div className="card-surface rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Clock size={16} className="text-[#E86711]" />
            <h3 className="font-bold uppercase tracking-wider text-xs">Digital Clock Header</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.showClock !== false}
                onChange={(e) => handleChange('showClock', e.target.checked)}
                className="rounded border-white/20 bg-white/5 accent-[#C44900] w-4 h-4 cursor-pointer"
              />
              <span>Show Digital Clock on Today&apos;s Card</span>
            </label>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-white/70">Clock Font:</label>
                <select
                  value={formData.clockFontFamily || 'Segoe UI'}
                  onChange={(e) => handleChange('clockFontFamily', e.target.value)}
                  className="w-full bg-[#101010] border border-white/15 rounded-xl px-3 py-1.5 text-white outline-none"
                >
                  {fontOptions.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-white/70">Alignment:</label>
                <select
                  value={formData.clockAlignment || 'left'}
                  onChange={(e) => handleChange('clockAlignment', e.target.value as any)}
                  className="w-full bg-[#101010] border border-white/15 rounded-xl px-3 py-1.5 text-white outline-none"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!formData.clock12Hour}
                  onChange={(e) => handleChange('clock12Hour', e.target.checked)}
                  className="rounded border-white/20 bg-white/5 accent-[#C44900] w-4 h-4 cursor-pointer"
                />
                <span>12-Hour Format (AM/PM)</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-white/70">Color:</span>
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
        <div className="card-surface rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Sliders size={16} className="text-[#E86711]" />
            <h3 className="font-bold uppercase tracking-wider text-xs">Layout & System Sync</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!formData.autoStart}
                onChange={(e) => handleChange('autoStart', e.target.checked)}
                className="rounded border-white/20 bg-white/5 accent-[#C44900] w-4 h-4 cursor-pointer"
              />
              <span>Launch Widget on Windows Startup</span>
            </label>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-white/70">Days to Display:</label>
                <select
                  value={formData.displayDays || 7}
                  onChange={(e) => handleChange('displayDays', Number(e.target.value))}
                  className="w-full bg-[#101010] border border-white/15 rounded-xl px-3 py-1.5 text-white outline-none"
                >
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} Days
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-white/70">Sync Interval:</label>
                <select
                  value={formData.fetchInterval || 1}
                  onChange={(e) => handleChange('fetchInterval', Number(e.target.value))}
                  className="w-full bg-[#101010] border border-white/15 rounded-xl px-3 py-1.5 text-white outline-none"
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
                <label className="text-white/70">Date Group Spacing:</label>
                <span className="font-mono text-white/90">{formData.dateSpacing ?? 16}px</span>
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
        <div className="card-surface rounded-2xl p-5 border border-white/10 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <CheckSquare size={16} className="text-[#E86711]" />
            <h3 className="font-bold uppercase tracking-wider text-xs">Task Automation & Done Rules</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.enableMarkDone !== false}
                onChange={(e) => handleChange('enableMarkDone', e.target.checked)}
                className="rounded border-white/20 bg-white/5 accent-[#C44900] w-4 h-4 cursor-pointer"
              />
              <span>Enable Mark as Done</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.showCompletedEvents !== false}
                onChange={(e) => handleChange('showCompletedEvents', e.target.checked)}
                className="rounded border-white/20 bg-white/5 accent-[#C44900] w-4 h-4 cursor-pointer"
              />
              <span>Show Completed (Strikethrough)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.showEmptyDays !== false}
                onChange={(e) => handleChange('showEmptyDays', e.target.checked)}
                className="rounded border-white/20 bg-white/5 accent-[#C44900] w-4 h-4 cursor-pointer"
              />
              <span>Show Days Without Events</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
