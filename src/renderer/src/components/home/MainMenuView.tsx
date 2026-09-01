import React from 'react';

interface MainMenuViewProps {
  onOpenCalendar: () => void;
  onOpenSettings: () => void;
  onOpenAddCalendar: () => void;
  onOpenManageCalendars: () => void;
}

export const MainMenuView: React.FC<MainMenuViewProps> = ({
  onOpenCalendar,
  onOpenSettings,
  onOpenAddCalendar,
  onOpenManageCalendars
}) => {
  const handleOpenTutorial = async () => {
    try {
      const ok = await window.electronAPI?.openTutorial();
      if (!ok) alert('Unable to open tutorial PDF.');
    } catch (e: any) {
      alert('Failed to open tutorial: ' + e?.message);
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 text-white flex flex-col space-y-2.5 animate-fade-in">
      <h2 className="text-base font-semibold mb-1 text-center">Calendar Widget</h2>

      <button
        type="button"
        onClick={onOpenCalendar}
        className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold btn-primary cursor-pointer select-none"
      >
        Open Calendar
      </button>

      <button
        type="button"
        onClick={onOpenSettings}
        className="w-full py-2.5 px-4 rounded-lg text-sm font-medium btn-glass text-white cursor-pointer select-none"
      >
        Settings
      </button>

      <button
        type="button"
        onClick={handleOpenTutorial}
        className="w-full py-2.5 px-4 rounded-lg text-sm font-medium btn-glass text-white cursor-pointer select-none"
      >
        Tutorial
      </button>

      <button
        type="button"
        onClick={onOpenAddCalendar}
        className="w-full py-2.5 px-4 rounded-lg text-sm font-medium btn-glass text-white cursor-pointer select-none"
      >
        Add Calendar
      </button>

      <button
        type="button"
        onClick={onOpenManageCalendars}
        className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold btn-primary cursor-pointer select-none"
      >
        Manage Calendars
      </button>
    </div>
  );
};
