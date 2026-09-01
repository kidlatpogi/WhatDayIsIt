export interface UIConfig {
  fontSize?: number;
  collapsed?: boolean;
  clickThrough?: boolean;
  autoStart?: boolean;
  alwaysOnTop?: boolean;
  rememberPosition?: boolean;
  fetchInterval?: number;
  scheduleColor?: string;
  dateTimeColor?: string;
  highlightColor?: string;
  upcomingColor?: string;
  dayColor?: string;
  dateColor?: string;
  dateSpacing?: number;
  fontFamily?: string;
  showClock?: boolean;
  clockColor?: string;
  clockFontFamily?: string;
  clockSize?: number;
  clockAlignment?: 'left' | 'center' | 'right';
  clock12Hour?: boolean;
  enableMarkDone?: boolean;
  markDoneMethod?: 'right-click' | 'double-click';
  showCompletedEvents?: boolean;
  showEmptyDays?: boolean;
  autoClearOnRefresh?: boolean;
  displayDays?: number;
  windowPos?: { x?: number; y?: number };
}

export interface ICalEntry {
  url: string;
  etag?: string | null;
  lastModified?: string | null;
  _lastChecked?: number;
  _lastHash?: string;
}

export interface AppConfig {
  icals: ICalEntry[];
  ui: UIConfig;
  completedEvents: Record<string, boolean>;
  acceptedTerms: boolean;
  windowBounds: Record<string, { width?: number; height?: number; x?: number; y?: number }>;
  firstLaunch: boolean;
}

export interface CalendarEvent {
  id?: string;
  summary: string;
  start: {
    date?: string;
    dateTime?: string;
  };
  end?: {
    date?: string;
    dateTime?: string;
  };
}

export interface ElectronAPI {
  fetchEvents: () => Promise<CalendarEvent[]>;
  onRefresh: (cb: () => void) => () => void;
  onConfigUpdated: (cb: (cfg: AppConfig) => void) => () => void;
  onToggleCollapse: (cb: () => void) => () => void;
  onPerformMemoryClean?: (cb: () => void) => () => void;
  acceptTerms: () => Promise<boolean>;
  addIcal: (url: string) => Promise<ICalEntry[]>;
  removeIcal: (url: string) => Promise<{ ok: boolean; icals?: ICalEntry[]; error?: string }>;
  listConfig: () => Promise<AppConfig>;
  getConfig: () => Promise<AppConfig>;
  setConfig: (partial: Partial<UIConfig>) => Promise<AppConfig>;
  saveConfig: (cfg: Partial<AppConfig>) => Promise<boolean>;
  openMain: () => Promise<boolean>;
  openHome: () => Promise<boolean>;
  openUrl: (url: string) => Promise<void>;
  openTutorial: () => Promise<boolean>;
  reportHomeSize: (size: { w: number; h: number }) => Promise<boolean>;
  setClickThrough: (which: 'main' | 'home', enabled: boolean) => Promise<boolean>;
  moveWindowBy: (dx: number, dy: number) => Promise<boolean>;
  setWindowBounds: (which: 'main' | 'home', bounds: { width?: number; height?: number; x?: number; y?: number; persist?: boolean }) => Promise<boolean>;
  getContentSize: (which: 'main' | 'home') => Promise<[number, number] | null>;
  toggleVisibility: (which: 'main' | 'home') => Promise<boolean>;
  minimizeWindow: (which: 'main' | 'home') => Promise<void>;
  toggleMaximizeWindow: (which: 'main' | 'home') => Promise<void>;
  closeWindow: (which: 'main' | 'home') => Promise<void>;
  toggleCollapse: () => Promise<boolean>;
  showNotification?: (title: string, message: string) => Promise<boolean>;
  requestMainGC?: () => Promise<{ ok: boolean }>;
  clearMemory?: () => Promise<{ ok: boolean }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    __initialCollapsed?: boolean;
  }
}
