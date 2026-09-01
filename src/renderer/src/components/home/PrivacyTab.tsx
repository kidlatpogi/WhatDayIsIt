import React from 'react';
import { Shield, Lock, EyeOff, Server, HardDrive, CheckCircle2 } from 'lucide-react';

export const PrivacyTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Header Banner */}
      <div className="card-surface rounded-2xl p-6 border border-white/10 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Privacy & Security Architecture</h2>
            <p className="text-xs text-white/60">Strictly local data handling with zero telemetry</p>
          </div>
        </div>
      </div>

      {/* Grid of Security Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="card-surface rounded-2xl p-5 border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <HardDrive size={16} />
            <span>Local-Only Processing</span>
          </div>
          <p className="text-white/70 leading-relaxed">
            Your calendar events and preferences are parsed, computed, and saved entirely on your local machine in <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[11px]">%APPDATA%/Calendar Widget/config.json</code>.
          </p>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              <span>No proprietary cloud servers or intermediary proxies</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              <span>No user authentication credentials stored or requested</span>
            </li>
          </ul>
        </div>

        <div className="card-surface rounded-2xl p-5 border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
            <EyeOff size={16} />
            <span>Zero Telemetry & Analytics</span>
          </div>
          <p className="text-white/70 leading-relaxed">
            Calendar Widget contains no Google Analytics, Sentry, Mixpanel, or behavioral tracking SDKs. Your activity, device metadata, and schedule titles never leave your desktop.
          </p>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
              <span>Zero telemetry pings or network beacons</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
              <span>Clean open-source codebase auditable on GitHub</span>
            </li>
          </ul>
        </div>

        <div className="card-surface rounded-2xl p-5 border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-[#E86711] font-semibold">
            <Server size={16} />
            <span>Direct Google Calendar Sync</span>
          </div>
          <p className="text-white/70 leading-relaxed">
            When polling calendar feeds, standard HTTPS requests are made directly from your PC to Google’s iCal endpoints (<code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[11px]">calendar.google.com</code>) using TLS encryption and ETag caching.
          </p>
        </div>

        <div className="card-surface rounded-2xl p-5 border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <Lock size={16} />
            <span>Sandboxed Desktop Runtime</span>
          </div>
          <p className="text-white/70 leading-relaxed">
            Built using Electron security best practices with Context Isolation enabled, Node Integration disabled in renderers, and secure IPC message passing via Preload bridges.
          </p>
        </div>
      </div>
    </div>
  );
};
