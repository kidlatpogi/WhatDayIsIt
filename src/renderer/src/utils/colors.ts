export function hexToRgba(hex: string, alpha = 0.12): string {
  if (!hex || typeof hex !== 'string') return `rgba(163, 255, 51, ${alpha})`;
  
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  
  if (cleanHex.length !== 6) {
    return `rgba(163, 255, 51, ${alpha})`;
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return `rgba(163, 255, 51, ${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function applyCssVariables(ui: Record<string, any>): void {
  if (!ui) return;
  const root = document.documentElement;

  if (ui.fontFamily) {
    root.style.setProperty('--app-font-family', ui.fontFamily);
  }

  if (ui.fontSize) {
    const fs = Number(ui.fontSize) || 14;
    root.style.setProperty('--app-font-size', `${fs}px`);
    root.style.setProperty('--app-font-small', `${Math.max(10, fs - 2)}px`);
    root.style.setProperty('--app-font-large', `${Math.max(12, fs + 1)}px`);
  }

  if (ui.scheduleColor) root.style.setProperty('--schedule-color', ui.scheduleColor);
  if (ui.dateTimeColor) root.style.setProperty('--date-time-color', ui.dateTimeColor);

  if (ui.highlightColor) {
    root.style.setProperty('--highlight-color', ui.highlightColor);
    root.style.setProperty('--highlight-rgba', hexToRgba(ui.highlightColor, 0.12));
    root.style.setProperty('--ongoing-color', ui.highlightColor);
    root.style.setProperty('--ongoing-rgba', hexToRgba(ui.highlightColor, 0.12));
  }

  if (ui.upcomingColor) {
    root.style.setProperty('--upcoming-color', ui.upcomingColor);
    root.style.setProperty('--upcoming-rgba', hexToRgba(ui.upcomingColor, 0.12));
  } else if (ui.highlightColor) {
    root.style.setProperty('--upcoming-color', ui.highlightColor);
    root.style.setProperty('--upcoming-rgba', hexToRgba(ui.highlightColor, 0.12));
  }

  if (ui.dayColor) root.style.setProperty('--day-color', ui.dayColor);
  if (ui.dateColor) root.style.setProperty('--date-color', ui.dateColor);
  if (ui.dateSpacing !== undefined) root.style.setProperty('--date-spacing', `${ui.dateSpacing}px`);

  if (ui.clockColor) root.style.setProperty('--clock-color', ui.clockColor);
  if (ui.clockFontFamily) root.style.setProperty('--clock-font-family', ui.clockFontFamily);
  if (ui.clockSize !== undefined) root.style.setProperty('--clock-size', `${ui.clockSize}px`);
  if (ui.clockAlignment) root.style.setProperty('--clock-alignment', ui.clockAlignment);
}
