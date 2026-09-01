import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { AppConfig, UIConfig } from '../types';

export const DEFAULT_CONFIG: AppConfig = {
  icals: [],
  ui: {
    fontSize: 14,
    collapsed: false,
    clickThrough: false,
    autoStart: false,
    fetchInterval: 1,
    scheduleColor: '#ffffff',
    dateTimeColor: '#cfe9ff',
    highlightColor: '#a3ff33',
    upcomingColor: '#a3ff33',
    dayColor: '#ffffff',
    dateColor: '#cfe9ff',
    dateSpacing: 16,
    fontFamily: 'Segoe UI',
    showClock: true,
    clockColor: '#ffffff',
    clockFontFamily: 'Segoe UI',
    clockSize: 18,
    clockAlignment: 'left',
    clock12Hour: false,
    enableMarkDone: true,
    markDoneMethod: 'right-click',
    showCompletedEvents: true,
    showEmptyDays: true,
    autoClearOnRefresh: false,
    displayDays: 7
  },
  completedEvents: {},
  acceptedTerms: false,
  windowBounds: {},
  firstLaunch: true
};

export class ConfigManager {
  public cfgPath: string;
  public config: AppConfig;
  private _saveBoundsTimer: NodeJS.Timeout | null = null;

  constructor() {
    const userCfgDir = app.getPath('userData');
    this.cfgPath = path.join(userCfgDir, 'config.json');
    this.ensureUserConfigExists(userCfgDir);
    this.config = this.loadConfig();
  }

  private ensureUserConfigExists(userCfgDir: string): void {
    try {
      if (!fs.existsSync(userCfgDir)) {
        fs.mkdirSync(userCfgDir, { recursive: true });
      }
      if (!fs.existsSync(this.cfgPath)) {
        const packagedDefault = path.join(__dirname, '..', '..', 'assets', 'default-config.json');
        if (fs.existsSync(packagedDefault)) {
          try {
            fs.copyFileSync(packagedDefault, this.cfgPath);
            return;
          } catch {
            // fallback to writing DEFAULT_CONFIG
          }
        }
        fs.writeFileSync(this.cfgPath, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf8');
      }
    } catch {
      // ignore
    }
  }

  public loadConfig(): AppConfig {
    try {
      if (fs.existsSync(this.cfgPath)) {
        const content = fs.readFileSync(this.cfgPath, 'utf8');
        const parsed = JSON.parse(content);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          icals: Array.isArray(parsed.icals)
            ? parsed.icals.map((i: string | { url: string }) => (typeof i === 'string' ? { url: i } : i))
            : [],
          ui: {
            ...DEFAULT_CONFIG.ui,
            ...(parsed.ui || {})
          },
          completedEvents: parsed.completedEvents || {},
          windowBounds: parsed.windowBounds || {},
          acceptedTerms: !!parsed.acceptedTerms,
          firstLaunch: parsed.firstLaunch !== undefined ? !!parsed.firstLaunch : false
        };
      }
    } catch {
      // ignore read error and return default
    }
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }

  public saveConfig(cfg: AppConfig = this.config): void {
    try {
      this.config = cfg;
      fs.writeFileSync(this.cfgPath, JSON.stringify(cfg, null, 2), 'utf8');
    } catch {
      // ignore
    }
  }

  public updateConfig(partialUI: Partial<UIConfig>): void {
    if (!this.config) this.config = this.loadConfig();
    this.config.ui = {
      ...this.config.ui,
      ...partialUI
    };
    this.saveConfig();
  }

  public updateRootConfig(partial: Partial<AppConfig>): void {
    if (!this.config) this.config = this.loadConfig();
    this.config = {
      ...this.config,
      ...partial
    };
    this.saveConfig();
  }

  public persistWindowBoundsDebounced(winKey: string, bounds: { width?: number; height?: number; x?: number; y?: number }): void {
    this.config.windowBounds = this.config.windowBounds || {};
    this.config.windowBounds[winKey] = {
      ...(this.config.windowBounds[winKey] || {}),
      ...bounds
    };
    if (this._saveBoundsTimer) clearTimeout(this._saveBoundsTimer);
    this._saveBoundsTimer = setTimeout(() => this.saveConfig(), 250);
  }
}
