import React, { useState } from 'react';

interface WelcomeViewProps {
  onAccept: () => void;
  onOpenTerms: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onAccept, onOpenTerms }) => {
  const [accepted, setAccepted] = useState(false);

  const handleOpenGithub = () => {
    window.electronAPI?.openUrl('https://github.com/kidlatpogi/Calendar-Widget');
  };

  return (
    <div className="glass-card rounded-xl p-5 text-white flex flex-col space-y-4 animate-fade-in">
      <h2 className="text-base font-semibold">Welcome</h2>
      <p className="text-xs text-white/80 leading-relaxed">
        Calendar Widget displays your Google Calendar events on your desktop.
      </p>

      <label className="flex items-center gap-2.5 text-xs text-white/90 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="rounded border-white/20 bg-white/5 accent-indigo-500 w-4 h-4 cursor-pointer"
        />
        <span>
          I accept the{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onOpenTerms();
            }}
            className="text-indigo-300 underline hover:text-indigo-200"
          >
            Terms & Conditions
          </button>
        </span>
      </label>

      <div className="space-y-2 pt-2">
        <button
          type="button"
          disabled={!accepted}
          onClick={onAccept}
          className="w-full py-2 px-4 rounded-lg text-sm font-semibold btn-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Accept & Continue
        </button>

        <button
          type="button"
          onClick={handleOpenGithub}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium btn-glass text-white cursor-pointer"
        >
          View on GitHub
        </button>
      </div>
    </div>
  );
};
