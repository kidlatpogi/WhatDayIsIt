import React, { useState, useEffect } from 'react';
import { UIConfig } from '../../../../types';
import { applyCssVariables } from '../../utils/colors';

interface SettingsViewProps {
  initialUI: UIConfig;
  onSave: (settings: Partial<UIConfig>) => Promise<void>;
  onCancel: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ initialUI, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UIConfig>({ ...initialUI });
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    setFormData({ ...initialUI });
  }, [initialUI]);

  // Live CSS variable updates as user adjusts pickers
  const handleChange = (key: keyof UIConfig, value: any) => {
    const next = { ...formData, [key]: value };
    setFormData(next);
    applyCssVariables(next);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(formData);
      setStatusMsg('Settings saved!');
      setTimeout(() => setStatusMsg(null), 2000);
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
    <div className="glass-card rounded-xl p-5 text-white flex flex-col max-h-[calc(100vh-80px)] overflow-y-auto animate-fade-in">
      <h2 className="text-base font-semibold mb-4 border-b border-white/10 pb-2">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6 text-xs">
        {/* System Settings */}
        <div className="flex flex-col space-y-3 bg-white/[0.02] p-3.5 rounded-lg border border-white/5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-300">System</h4>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!formData.autoStart}
              onChange={(e) => handleChange('autoStart', e.target.checked)}
              className="rounded border-white/20 bg-white/5 accent-indigo-500"
            />
            <span>Run on startup</span>
          </label>

          <div className="flex flex-col space-y-1">
            <label className="text-white/70">Fetch Interval (minutes):</label>
            <select
              value={formData.fetchInterval || 1}
              onChange={(e) => handleChange('fetchInterval', Number(e.target.value))}
              className="bg-neutral-800 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-400"
            >
              <option value="1">1</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="30">30</option>
              <option value="60">60</option>
            </select>
          </div>
        </div>

        {/* Layout Settings */}
        <div className="flex flex-col space-y-3 bg-white/[0.02] p-3.5 rounded-lg border border-white/5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-300">Layout</h4>

          <div className="flex flex-col space-y-1">
            <label className="text-white/70">Days to show (1–14):</label>
            <select
              value={formData.displayDays || 7}
              onChange={(e) => handleChange('displayDays', Number(e.target.value))}
              className="bg-neutral-800 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-400"
            >
              {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-white/70">Date Spacing (px):</label>
            <input
              type="number"
              min="4"
              max="32"
              value={formData.dateSpacing ?? 16}
              onChange={(e) => handleChange('dateSpacing', Number(e.target.value))}
              className="bg-neutral-800 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Typography */}
        <div className="flex flex-col space-y-3 bg-white/[0.02] p-3.5 rounded-lg border border-white/5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-300">Typography</h4>

          <div className="flex flex-col space-y-1">
            <label className="text-white/70">Font Family:</label>
            <select
              value={formData.fontFamily || 'Segoe UI'}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="bg-neutral-800 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-400"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-white/70">Font Size (px):</label>
            <input
              type="number"
              min="10"
              max="20"
              value={formData.fontSize ?? 14}
              onChange={(e) => handleChange('fontSize', Number(e.target.value))}
              className="bg-neutral-800 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="flex flex-col space-y-3 bg-white/[0.02] p-3.5 rounded-lg border border-white/5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-300">Colors</h4>

          <div className="flex items-center justify-between">
            <label className="text-white/70">Event Title Color:</label>
            <input
              type="color"
              value={formData.scheduleColor || '#ffffff'}
              onChange={(e) => handleChange('scheduleColor', e.target.value)}
              className="w-8 h-6 bg-transparent border-0 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-white/70">Time Color:</label>
            <input
              type="color"
              value={formData.dateTimeColor || '#cfe9ff'}
              onChange={(e) => handleChange('dateTimeColor', e.target.value)}
              className="w-8 h-6 bg-transparent border-0 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-white/70">Highlight Color:</label>
            <input
              type="color"
              value={formData.highlightColor || '#a3ff33'}
              onChange={(e) => handleChange('highlightColor', e.target.value)}
              className="w-8 h-6 bg-transparent border-0 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-white/70">Day Header Color:</label>
            <input
              type="color"
              value={formData.dayColor || '#ffffff'}
              onChange={(e) => handleChange('dayColor', e.target.value)}
              className="w-8 h-6 bg-transparent border-0 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-white/70">Date Text Color:</label>
            <input
              type="color"
              value={formData.dateColor || '#cfe9ff'}
              onChange={(e) => handleChange('dateColor', e.target.value)}
              className="w-8 h-6 bg-transparent border-0 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-white/70">Upcoming Event Color:</label>
            <input
              type="color"
              value={formData.upcomingColor || '#a3ff33'}
              onChange={(e) => handleChange('upcomingColor', e.target.value)}
              className="w-8 h-6 bg-transparent border-0 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Clock Display */}
        <div className="flex flex-col space-y-3 bg-white/[0.02] p-3.5 rounded-lg border border-white/5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-300">Clock Display</h4>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showClock !== false}
              onChange={(e) => handleChange('showClock', e.target.checked)}
              className="rounded border-white/20 bg-white/5 accent-indigo-500"
            />
            <span>Show Clock on Top</span>
          </label>

          <div className="flex items-center justify-between">
            <label className="text-white/70">Clock Color:</label>
            <input
              type="color"
              value={formData.clockColor || '#ffffff'}
              onChange={(e) => handleChange('clockColor', e.target.value)}
              className="w-8 h-6 bg-transparent border-0 rounded cursor-pointer"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-white/70">Clock Font:</label>
            <select
              value={formData.clockFontFamily || 'Segoe UI'}
              onChange={(e) => handleChange('clockFontFamily', e.target.value)}
              className="bg-neutral-800 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-400"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-white/70">Clock Size (px):</label>
            <input
              type="number"
              min="10"
              max="48"
              value={formData.clockSize ?? 18}
              onChange={(e) => handleChange('clockSize', Number(e.target.value))}
              className="bg-neutral-800 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-white/70">Clock Alignment:</label>
            <select
              value={formData.clockAlignment || 'left'}
              onChange={(e) => handleChange('clockAlignment', e.target.value as any)}
              className="bg-neutral-800 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-400"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!formData.clock12Hour}
              onChange={(e) => handleChange('clock12Hour', e.target.checked)}
              className="rounded border-white/20 bg-white/5 accent-indigo-500"
            />
            <span>Use 12-Hour Format (AM/PM)</span>
          </label>
        </div>

        {/* Task Done Settings */}
        <div className="flex flex-col space-y-3 bg-white/[0.02] p-3.5 rounded-lg border border-white/5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-300">Task Done Settings</h4>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enableMarkDone !== false}
              onChange={(e) => handleChange('enableMarkDone', e.target.checked)}
              className="rounded border-white/20 bg-white/5 accent-indigo-500"
            />
            <span>Enable Mark as Done</span>
          </label>

          <div className="flex flex-col space-y-1">
            <label className="text-white/70">Mark Done Method:</label>
            <select
              value={formData.markDoneMethod || 'right-click'}
              onChange={(e) => handleChange('markDoneMethod', e.target.value as any)}
              className="bg-neutral-800 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-400"
            >
              <option value="right-click">Right-click Menu</option>
              <option value="double-click">Double-click</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showCompletedEvents !== false}
              onChange={(e) => handleChange('showCompletedEvents', e.target.checked)}
              className="rounded border-white/20 bg-white/5 accent-indigo-500"
            />
            <span>Show Completed Events</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showEmptyDays !== false}
              onChange={(e) => handleChange('showEmptyDays', e.target.checked)}
              className="rounded border-white/20 bg-white/5 accent-indigo-500"
            />
            <span>Show Days Without Events</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!formData.autoClearOnRefresh}
              onChange={(e) => handleChange('autoClearOnRefresh', e.target.checked)}
              className="rounded border-white/20 bg-white/5 accent-indigo-500"
            />
            <span>Auto Clear Memory on Refresh</span>
          </label>
        </div>
      </div>

      {statusMsg && (
        <div className="text-center text-xs text-emerald-400 font-semibold mb-3">
          ✓ {statusMsg}
        </div>
      )}

      {/* Sticky footer actions */}
      <div className="sticky bottom-0 bg-gradient-to-t from-darkBg via-darkBg/95 to-transparent pt-3 pb-1 flex gap-3 border-t border-white/10">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 py-2 px-4 rounded-lg text-xs font-semibold btn-primary cursor-pointer disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 rounded-lg text-xs font-medium btn-glass text-white cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
