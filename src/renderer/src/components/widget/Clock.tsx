import React, { useState, useEffect } from 'react';
import { UIConfig } from '../../../../types';

interface ClockProps {
  ui: UIConfig;
}

export const Clock: React.FC<ClockProps> = ({ ui }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');

      if (ui.clock12Hour) {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        setTimeStr(`${hours}:${minutes} ${ampm}`);
      } else {
        const hStr = String(hours).padStart(2, '0');
        setTimeStr(`${hStr}:${minutes}`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [ui.clock12Hour]);

  if (ui.showClock === false) {
    return null;
  }

  const alignmentClass =
    ui.clockAlignment === 'center'
      ? 'text-center'
      : ui.clockAlignment === 'right'
      ? 'text-right'
      : 'text-left';

  return (
    <div
      className={`clock-header font-semibold pb-1 mb-1 border-b border-white/10 ${alignmentClass}`}
      style={{
        color: ui.clockColor || 'var(--clock-color)',
        fontFamily: ui.clockFontFamily ? `"${ui.clockFontFamily}", sans-serif` : 'var(--clock-font-family)',
        fontSize: ui.clockSize ? `${ui.clockSize}px` : 'var(--clock-size)'
      }}
    >
      {timeStr}
    </div>
  );
};
