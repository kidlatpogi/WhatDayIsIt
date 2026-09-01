import React, { useState } from 'react';
import { Calendar, ShieldCheck, Check, ExternalLink } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const currentYear = new Date().getFullYear();

  if (!isOpen) return null;

  const handleOpenGithub = () => {
    window.electronAPI?.openUrl('https://github.com/kidlatpogi/Calendar-Widget');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-in text-white">
      <div
        className="relative w-full max-w-lg rounded-2xl p-7 md:p-8 shadow-2xl space-y-6"
        style={{
          backgroundColor: '#1c1b1b',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#C44900]/20 text-[#E86711] rounded-2xl border border-[#C44900]/30">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Welcome to Calendar Widget</h2>
            <p className="text-xs text-white/60">Local-first desktop timeline overlay for Google Calendar</p>
          </div>
        </div>

        <div
          className="p-4 rounded-xl space-y-2.5 text-xs text-white/80 leading-relaxed font-sans"
          style={{
            backgroundColor: '#101010',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div className="flex items-center gap-2 text-[#E86711] font-semibold text-xs">
            <ShieldCheck size={16} />
            <span>Local Privacy & Terms Guarantee:</span>
          </div>
          <ul className="list-disc pl-4 space-y-1.5 text-white/70">
            <li>Calendar feeds are fetched and processed 100% locally on your machine.</li>
            <li>No intermediary cloud servers, telemetry trackers, or third-party analytics.</li>
            <li>Your iCal URLs and completion state remain solely on your PC in local storage.</li>
            <li>Open-source software provided under the custom MIT License.</li>
          </ul>
        </div>

        <label className="flex items-center gap-3 text-xs text-white cursor-pointer select-none">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="rounded accent-[#C44900] w-4 h-4 cursor-pointer"
          />
          <span>I accept the local data terms and privacy conditions</span>
        </label>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            disabled={!accepted}
            onClick={onAccept}
            className="flex-1 btn-accent py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={14} />
            <span>Accept & Get Started</span>
          </button>

          <button
            type="button"
            onClick={handleOpenGithub}
            className="btn-surface py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 text-white/80 hover:text-white cursor-pointer"
          >
            <ExternalLink size={14} />
            <span>GitHub</span>
          </button>
        </div>

        <div className="text-center text-[10px] text-white/40">
          Copyright © {currentYear} Zeus Angelo Bautista
        </div>
      </div>
    </div>
  );
};
