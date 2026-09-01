import { app, globalShortcut, Menu } from 'electron';
import { ConfigManager } from './config-manager';
import { IcalService } from './ical-service';
import { WindowManager } from './window-manager';
import { TrayManager } from './tray-manager';
import { setupIpcHandlers } from './ipc-handlers';

// Hardware acceleration is preserved for native Windows DirectComposition DWM transparency
app.commandLine.appendSwitch('v8-cache-options', 'none');

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  let configManager: ConfigManager;
  let icalService: IcalService;
  let windowManager: WindowManager;
  let trayManager: TrayManager;

  app.on('second-instance', () => {
    if (windowManager) {
      if (windowManager.win && !windowManager.win.isDestroyed()) {
        try {
          windowManager.win.showInactive();
        } catch {
          windowManager.win.show();
        }
      } else {
        windowManager.createMainWindow();
      }
    }
  });

  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);

    configManager = new ConfigManager();
    icalService = new IcalService(configManager);
    windowManager = new WindowManager(configManager, icalService);
    trayManager = new TrayManager(windowManager, icalService);

    setupIpcHandlers(configManager, icalService, windowManager);

    const isFirstLaunch = configManager.config.firstLaunch === true || !configManager.config.acceptedTerms;

    if (isFirstLaunch) {
      windowManager.createHomeWindow();
      if (configManager.config.firstLaunch) {
        configManager.updateRootConfig({ firstLaunch: false });
      }
    } else {
      windowManager.createMainWindow();
    }

    const intervalMinutes = configManager.config.ui?.fetchInterval || 1;
    icalService.startPolling(intervalMinutes);

    trayManager.setupTray();
    windowManager.setupAutoLaunch();

    try {
      globalShortcut.register('Control+Shift+C', () => {
        try {
          windowManager.toggleClickThrough();
        } catch {
          // ignore
        }
      });

      globalShortcut.register('Control+Shift+M', () => {
        try {
          windowManager.toggleCollapse();
        } catch {
          // ignore
        }
      });
    } catch {
      // ignore shortcut registration errors
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
    if (icalService) {
      icalService.stopPolling();
    }
  });
}
