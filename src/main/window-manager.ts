import { BrowserWindow, screen, app } from 'electron';
import path from 'path';
import { ConfigManager } from './config-manager';
import { IcalService } from './ical-service';

export class WindowManager {
  public win: BrowserWindow | null = null;
  public homeWin: BrowserWindow | null = null;
  private cfgManager: ConfigManager;
  private icalService: IcalService;

  constructor(cfgManager: ConfigManager, icalService: IcalService) {
    this.cfgManager = cfgManager;
    this.icalService = icalService;
  }

  public createMainWindow(): BrowserWindow {
    if (this.win && !this.win.isDestroyed()) {
      try {
        this.win.showInactive();
      } catch {
        this.win.show();
      }
      return this.win;
    }

    const cfg = this.cfgManager.config;
    const windowPos = cfg.ui?.windowPos || { x: undefined, y: undefined };

    let targetDisplay = screen.getPrimaryDisplay();
    let posX: number;
    let posY: number;

    if (typeof windowPos.x === 'number' && typeof windowPos.y === 'number' && !isNaN(windowPos.x) && !isNaN(windowPos.y)) {
      targetDisplay = screen.getDisplayMatching({
        x: windowPos.x,
        y: windowPos.y,
        width: 400,
        height: 400
      });
      posX = windowPos.x;
      posY = windowPos.y;
    } else {
      // Default to upper-right corner of primary screen
      posX = targetDisplay.workArea.x + targetDisplay.workArea.width - 430;
      posY = targetDisplay.workArea.y + 20;
    }

    const { height: screenHeight } = targetDisplay.workAreaSize;
    const iconPath = path.join(__dirname, '..', '..', 'assets', 'calendar.ico');
    const preloadPath = path.join(__dirname, '..', 'preload', 'index.js');

    const windowOptions: Electron.BrowserWindowConstructorOptions = {
      x: Math.round(posX),
      y: Math.round(posY),
      width: 400,
      height: screenHeight,
      transparent: true,
      backgroundColor: '#00000000',
      hasShadow: false,
      frame: false,
      alwaysOnTop: cfg.ui?.alwaysOnTop ?? false,
      skipTaskbar: true,
      autoHideMenuBar: true,
      show: false,
      icon: iconPath,
      webPreferences: {
        preload: preloadPath,
        nodeIntegration: false,
        sandbox: true,
        contextIsolation: true
      }
    };

    this.win = new BrowserWindow(windowOptions);
    this.icalService.mainWindow = this.win;

    try {
      this.win.setMenuBarVisibility(false);
    } catch {
      // ignore
    }

    const isCollapsed = cfg.ui?.collapsed === true;
    const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
    const rendererPath = path.join(__dirname, '..', '..', 'dist', 'index.html');

    if (isDev && process.env.VITE_DEV_SERVER_URL) {
      this.win.loadURL(`${process.env.VITE_DEV_SERVER_URL}?view=widget&collapsed=${isCollapsed ? 'true' : 'false'}`);
    } else {
      this.win.loadFile(rendererPath, {
        query: {
          view: 'widget',
          collapsed: isCollapsed ? 'true' : 'false'
        }
      });
    }

    this.win.once('ready-to-show', () => {
      try {
        this.win?.showInactive();
      } catch {
        this.win?.show();
      }
      if (cfg.ui?.clickThrough) {
        this.win?.setIgnoreMouseEvents(true, { forward: true });
      }
    });

    const rememberPosition = cfg.ui?.rememberPosition !== false;
    const savePos = () => {
      if (rememberPosition && this.win && !this.win.isDestroyed()) {
        const [x, y] = this.win.getPosition();
        this.cfgManager.persistWidgetPositionImmediate(x, y);
      }
    };

    this.win.on('moved', savePos);
    this.win.on('resize', savePos);
    this.win.on('close', savePos);

    this.win.on('closed', () => {
      this.win = null;
      this.icalService.mainWindow = null;
    });

    return this.win;
  }

  public createHomeWindow(): BrowserWindow {
    if (this.homeWin && !this.homeWin.isDestroyed()) {
      if (this.homeWin.isMinimized()) this.homeWin.restore();
      this.homeWin.show();
      this.homeWin.focus();
      return this.homeWin;
    }

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
    const windowWidth = Math.min(1240, Math.floor(screenWidth * 0.9));
    const windowHeight = Math.min(800, Math.floor(screenHeight * 0.88));

    const iconPath = path.join(__dirname, '..', '..', 'assets', 'calendar.ico');
    const preloadPath = path.join(__dirname, '..', 'preload', 'index.js');

    this.homeWin = new BrowserWindow({
      width: windowWidth,
      height: windowHeight,
      minWidth: 800,
      minHeight: 600,
      transparent: false,
      backgroundColor: '#141313',
      frame: true,
      alwaysOnTop: false,
      skipTaskbar: false,
      autoHideMenuBar: true,
      icon: iconPath,
      webPreferences: {
        preload: preloadPath,
        nodeIntegration: false,
        sandbox: true,
        contextIsolation: true
      }
    });

    this.icalService.homeWindow = this.homeWin;

    try {
      this.homeWin.setMenuBarVisibility(false);
    } catch {
      // ignore
    }

    const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
    const rendererPath = path.join(__dirname, '..', '..', 'dist', 'index.html');

    if (isDev && process.env.VITE_DEV_SERVER_URL) {
      this.homeWin.loadURL(`${process.env.VITE_DEV_SERVER_URL}?view=home`);
    } else {
      this.homeWin.loadFile(rendererPath, {
        query: { view: 'home' }
      });
    }

    this.homeWin.once('ready-to-show', () => {
      this.homeWin?.show();
    });

    this.homeWin.on('closed', () => {
      this.homeWin = null;
      this.icalService.homeWindow = null;
    });

    return this.homeWin;
  }

  public toggleClickThrough(): boolean {
    const cfg = this.cfgManager.config;
    const next = !cfg.ui?.clickThrough;
    this.cfgManager.updateConfig({ clickThrough: next });

    if (this.win && !this.win.isDestroyed()) {
      try {
        this.win.setIgnoreMouseEvents(next, { forward: true });
      } catch {
        // ignore
      }
    }

    this.broadcastConfigUpdated();
    return next;
  }

  public toggleCollapse(): boolean {
    const cfg = this.cfgManager.config;
    const next = !cfg.ui?.collapsed;
    this.cfgManager.updateConfig({ collapsed: next });

    if (this.win && !this.win.isDestroyed()) {
      this.win.webContents.send('toggle-collapse');
    }
    this.broadcastConfigUpdated();
    return next;
  }

  public broadcastConfigUpdated(): void {
    const cfg = this.cfgManager.config;
    if (this.win && !this.win.isDestroyed()) {
      this.win.webContents.send('config-updated', cfg);
    }
    if (this.homeWin && !this.homeWin.isDestroyed()) {
      this.homeWin.webContents.send('config-updated', cfg);
    }
  }

  public setupAutoLaunch(): void {
    try {
      if (!app.isPackaged) return;

      const AutoLaunch = require('auto-launch');
      const autoLauncher = new AutoLaunch({
        name: 'WhatDayIsIt',
        path: app.getPath('exe')
      });

      const shouldAutoStart = this.cfgManager.config.ui?.autoStart || false;
      if (shouldAutoStart) {
        autoLauncher.enable().catch(() => {});
      } else {
        autoLauncher.disable().catch(() => {});
      }
    } catch {
      // ignore
    }
  }
}
