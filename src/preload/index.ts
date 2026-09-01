import { contextBridge, ipcRenderer } from 'electron';
import { ElectronAPI, UIConfig, AppConfig } from '../types';

const api: ElectronAPI = {
  fetchEvents: () => ipcRenderer.invoke('fetch-events'),
  onRefresh: (cb: () => void) => {
    const listener = () => cb();
    ipcRenderer.on('refresh-events', listener);
    return () => {
      ipcRenderer.removeListener('refresh-events', listener);
    };
  },
  onConfigUpdated: (cb: (cfg: AppConfig) => void) => {
    const listener = (_ev: Electron.IpcRendererEvent, cfg: AppConfig) => cb(cfg);
    ipcRenderer.on('config-updated', listener);
    return () => {
      ipcRenderer.removeListener('config-updated', listener);
    };
  },
  onToggleCollapse: (cb: () => void) => {
    const listener = () => cb();
    ipcRenderer.on('toggle-collapse', listener);
    return () => {
      ipcRenderer.removeListener('toggle-collapse', listener);
    };
  },
  acceptTerms: () => ipcRenderer.invoke('accept-terms'),
  addIcal: (url: string) => ipcRenderer.invoke('add-ical', url),
  removeIcal: (url: string) => ipcRenderer.invoke('remove-ical', url),
  listConfig: () => ipcRenderer.invoke('list-config'),
  getConfig: () => ipcRenderer.invoke('get-config'),
  setConfig: (partial: Partial<UIConfig>) => ipcRenderer.invoke('set-config', partial),
  saveConfig: (cfg: Partial<AppConfig>) => ipcRenderer.invoke('save-config', cfg),
  openMain: () => ipcRenderer.invoke('open-main'),
  openHome: () => ipcRenderer.invoke('open-home'),
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url),
  openTutorial: () => ipcRenderer.invoke('open-tutorial'),
  reportHomeSize: (size: { w: number; h: number }) => ipcRenderer.invoke('report-home-size', size),
  setClickThrough: (which: 'main' | 'home', enabled: boolean) => ipcRenderer.invoke('set-click-through', which, enabled),
  moveWindowBy: (dx: number, dy: number) => ipcRenderer.invoke('move-window-by', dx, dy),
  setWindowBounds: (which: 'main' | 'home', bounds: { width?: number; height?: number; x?: number; y?: number; persist?: boolean }) =>
    ipcRenderer.invoke('set-window-bounds', which, bounds),
  getContentSize: (which: 'main' | 'home') => ipcRenderer.invoke('get-content-size', which),
  toggleVisibility: (which: 'main' | 'home') => ipcRenderer.invoke('toggle-visibility', which),
  minimizeWindow: (which: 'main' | 'home') => ipcRenderer.invoke('minimize-window', which),
  toggleMaximizeWindow: (which: 'main' | 'home') => ipcRenderer.invoke('toggle-maximize-window', which),
  closeWindow: (which: 'main' | 'home') => ipcRenderer.invoke('close-window', which),
  toggleCollapse: () => ipcRenderer.invoke('toggle-collapse'),
  showNotification: (title: string, message: string) => ipcRenderer.invoke('show-notification', title, message)
};

contextBridge.exposeInMainWorld('electronAPI', api);
