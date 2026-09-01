import React from 'react';

interface ControlsProps {
  onOpenHome: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ onOpenHome, onRefresh, isRefreshing }) => {
  return (
    <div className="flex gap-2 mt-2 pt-2 border-t border-white/10 no-drag-region">
      <button
        type="button"
        title="Open welcome & settings"
        onClick={onOpenHome}
        className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-white btn-glass cursor-pointer select-none"
      >
        Home
      </button>
      <button
        type="button"
        title="Refresh calendar events"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-white btn-glass cursor-pointer select-none"
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
};
