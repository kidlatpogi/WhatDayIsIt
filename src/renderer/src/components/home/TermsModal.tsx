import React from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 glass-panel rounded-xl text-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white text-xl leading-none"
        >
          &times;
        </button>

        <h3 className="text-lg font-bold mb-3">Terms & Conditions</h3>

        <div className="max-h-[60vh] overflow-y-auto pr-2 text-xs leading-relaxed text-white/80 space-y-3 bg-black/20 p-3 rounded-lg border border-white/5">
          <p className="font-semibold text-white">By using Calendar Widget, you agree to:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Your calendar data is processed locally on your machine.</li>
            <li>No data is sent to external servers (except Google Calendar servers for fetching feeds).</li>
            <li>This is an open-source project provided as-is.</li>
            <li>The developer is not responsible for any calendar sync issues or data loss.</li>
            <li>Your iCal URLs and configuration are stored locally for convenience.</li>
          </ul>
          <p className="font-semibold text-white pt-1">Privacy Guarantee:</p>
          <p>All calendar events are cached strictly in local memory and storage. No telemetry, analytics, or remote tracking is used.</p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold btn-glass rounded-lg text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
