import { ipcMain, shell, BrowserWindow, Notification } from 'electron';
import path from 'path';
import fs from 'fs';
import { ConfigManager } from './config-manager';
import { IcalService } from './ical-service';
import { WindowManager } from './window-manager';
import { UIConfig, AppConfig } from '../types';

export function setupIpcHandlers(
  cfgManager: ConfigManager,
  icalService: IcalService,
  windowManager: WindowManager
): void {
  ipcMain.handle('fetch-events', async () => {
    try {
      return await icalService.fetchEvents();
    } catch {
      return [];
    }
  });

  ipcMain.handle('accept-terms', async () => {
    cfgManager.updateRootConfig({ acceptedTerms: true });
    return true;
  });

  ipcMain.handle('add-ical', async (_ev, url: string) => {
    if (!url || typeof url !== 'string') throw new Error('Invalid URL');
    const cfg = cfgManager.config;
    const cleanUrl = url.trim();
    if (!cfg.icals.some(i => i.url === cleanUrl)) {
      cfg.icals.push({ url: cleanUrl });
      cfgManager.saveConfig();
      // Immediately fetch new calendar in background and refresh windows
      icalService.refreshAllCalendars().then(() => {
        icalService.notifyWindowsRefresh();
      }).catch(() => {});
    }
    return cfg.icals;
  });

  ipcMain.handle('remove-ical', async (_ev, url: string) => {
    try {
      if (!url || typeof url !== 'string') throw new Error('Invalid URL');
      const cfg = cfgManager.config;
      cfg.icals = (cfg.icals || []).filter(i => {
        const u = typeof i === 'string' ? i : i.url;
        return u !== url;
      });
      cfgManager.saveConfig();
      icalService.refreshAllCalendars().then(() => {
        icalService.notifyWindowsRefresh();
      }).catch(() => {});
      return { ok: true, icals: cfg.icals };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  });

  ipcMain.handle('list-config', async () => cfgManager.config);
  ipcMain.handle('get-config', async () => cfgManager.config);

  ipcMain.handle('set-config', async (_ev, partial: Partial<UIConfig>) => {
    const wasCollapsed = cfgManager.config.ui?.collapsed;
    cfgManager.updateConfig(partial);

    // If collapsed was not part of partial update, preserve it
    if (partial.collapsed === undefined && typeof wasCollapsed === 'boolean') {
      cfgManager.config.ui.collapsed = wasCollapsed;
    }

    if (partial.fetchInterval) {
      icalService.startPolling(partial.fetchInterval);
    }

    if (partial.autoStart !== undefined) {
      windowManager.setupAutoLaunch();
    }

    windowManager.broadcastConfigUpdated();
    return cfgManager.config;
  });

  ipcMain.handle('save-config', async (_ev, cfg: Partial<AppConfig>) => {
    if (cfg) {
      cfgManager.updateRootConfig(cfg);
      windowManager.broadcastConfigUpdated();
      return true;
    }
    return false;
  });

  ipcMain.handle('open-main', async () => {
    windowManager.createMainWindow();
    if (windowManager.homeWin && !windowManager.homeWin.isDestroyed()) {
      try {
        windowManager.homeWin.close();
      } catch {
        // ignore
      }
    }
    return true;
  });

  ipcMain.handle('open-home', async () => {
    windowManager.createHomeWindow();
    return true;
  });

  ipcMain.handle('open-url', async (_ev, url: string) => {
    if (url && typeof url === 'string') {
      await shell.openExternal(url);
    }
  });

  ipcMain.handle('open-tutorial', async () => {
    try {
      const pdfPath = path.join(__dirname, '..', '..', 'Public', 'How to get ICal link.pdf');
      if (fs.existsSync(pdfPath)) {
        const res = await shell.openPath(pdfPath);
        return !res;
      }
      return false;
    } catch {
      return false;
    }
  });

  ipcMain.handle('report-home-size', async (ev, size: { w: number; h: number }) => {
    const bw = BrowserWindow.fromWebContents(ev.sender);
    if (!bw || !size) return false;
    const w = Math.max(300, Math.round(size.w || 400));
    const h = Math.max(200, Math.round(size.h || 500));
    bw.setContentSize(w, h);
    return true;
  });

  ipcMain.handle('set-click-through', async (_ev, which: 'main' | 'home', enabled: boolean) => {
    try {
      const bw = which === 'home' ? windowManager.homeWin : windowManager.win;
      if (!bw || bw.isDestroyed()) return false;
      bw.setIgnoreMouseEvents(!!enabled, { forward: true });
      return true;
    } catch {
      return false;
    }
  });

  ipcMain.handle('move-window-by', (ev, dx: number, dy: number) => {
    try {
      const w = BrowserWindow.fromWebContents(ev.sender) || windowManager.win;
      if (!w || w.isDestroyed()) return false;
      const [x, y] = w.getPosition();
      const newX = Math.round(x + dx);
      const newY = Math.round(y + dy);
      w.setPosition(newX, newY);
      if (w === windowManager.win) {
        cfgManager.persistWidgetPositionDebounced(newX, newY);
      }
      return true;
    } catch {
      return false;
    }
  });

  ipcMain.handle('save-widget-position', (_ev, pos: { x: number; y: number }) => {
    if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
      cfgManager.persistWidgetPositionImmediate(pos.x, pos.y);
      return true;
    }
    return false;
  });

  ipcMain.handle('set-window-bounds', async (_ev, which: 'main' | 'home', bounds: { width?: number; height?: number; x?: number; y?: number; persist?: boolean }) => {
    try {
      const bw = which === 'home' ? windowManager.homeWin : windowManager.win;
      if (!bw || bw.isDestroyed()) return false;

      const [curW, curH] = bw.getContentSize();
      const newW = typeof bounds.width === 'number' ? Math.round(bounds.width) : curW;
      const newH = typeof bounds.height === 'number' ? Math.round(bounds.height) : curH;

      bw.setContentSize(newW, newH);

      if (bounds.persist && typeof bounds.x === 'number' && typeof bounds.y === 'number') {
        bw.setPosition(Math.round(bounds.x), Math.round(bounds.y));
        cfgManager.persistWindowBoundsDebounced(which, { width: newW, height: newH, x: bounds.x, y: bounds.y });
      }

      return true;
    } catch {
      return false;
    }
  });

  ipcMain.handle('get-content-size', (_ev, which: 'main' | 'home') => {
    try {
      const bw = which === 'home' ? windowManager.homeWin : windowManager.win;
      if (!bw || bw.isDestroyed()) return null;
      return bw.getContentSize();
    } catch {
      return null;
    }
  });

  ipcMain.handle('toggle-visibility', (_ev, which: 'main' | 'home') => {
    const bw = which === 'home' ? windowManager.homeWin : windowManager.win;
    if (!bw || bw.isDestroyed()) return false;
    if (bw.isVisible()) {
      bw.hide();
    } else {
      try {
        bw.showInactive();
      } catch {
        bw.show();
      }
    }
    return true;
  });

  ipcMain.handle('minimize-window', (_ev, which: 'main' | 'home') => {
    const bw = which === 'home' ? windowManager.homeWin : windowManager.win;
    if (bw && !bw.isDestroyed()) bw.minimize();
  });

  ipcMain.handle('toggle-maximize-window', (_ev, which: 'main' | 'home') => {
    const bw = which === 'home' ? windowManager.homeWin : windowManager.win;
    if (bw && !bw.isDestroyed()) {
      if (bw.isMaximized()) bw.unmaximize();
      else bw.maximize();
    }
  });

  ipcMain.handle('close-window', (_ev, which: 'main' | 'home') => {
    const bw = which === 'home' ? windowManager.homeWin : windowManager.win;
    if (bw && !bw.isDestroyed()) bw.close();
  });

  ipcMain.handle('toggle-collapse', () => {
    return windowManager.toggleCollapse();
  });

  ipcMain.handle('show-notification', async (_ev, title: string, message: string) => {
    if (Notification.isSupported()) {
      new Notification({
        title: title || 'Calendar Event',
        body: message || '',
        icon: path.join(__dirname, '..', '..', 'assets', 'calendar.ico')
      }).show();
      return true;
    }
    return false;
  });
}
