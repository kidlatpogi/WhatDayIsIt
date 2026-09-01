import React from 'react';

export const Footer: React.FC = () => {
  const handleOpenGithub = () => {
    window.electronAPI?.openUrl('https://github.com/kidlatpogi');
  };

  const handleOpenPortfolio = () => {
    window.electronAPI?.openUrl('https://www.zeusbautista.site/');
  };

  return (
    <div className="mt-3 flex flex-col space-y-2 text-[11px] text-white/50 text-center select-none">
      <div className="flex items-center justify-center gap-3">
        <span>© 2025 Zeus Bautista</span>
        <span>•</span>
        <button
          type="button"
          onClick={handleOpenGithub}
          className="text-indigo-300 hover:text-indigo-200 underline cursor-pointer"
        >
          GitHub
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={handleOpenPortfolio}
          className="text-indigo-300 hover:text-indigo-200 underline cursor-pointer"
        >
          Portfolio
        </button>
      </div>

      <div className="text-[10px] text-white/40 space-y-0.5 pt-1">
        <p>
          <kbd className="px-1 py-0.5 bg-white/10 rounded">Ctrl+Shift+M</kbd> to <b>Hide Buttons</b>
        </p>
        <p>
          <kbd className="px-1 py-0.5 bg-white/10 rounded">Ctrl+Shift+C</kbd> to toggle <b>Click-through</b>
        </p>
        <p>Hold the space between the content and buttons to <b>drag</b></p>
      </div>
    </div>
  );
};
