import { useState, useEffect, useCallback } from 'react';
import { AppConfig, UIConfig } from '../../../types';
import { applyCssVariables } from '../utils/colors';

export function useConfig() {
  const [config, setConfigState] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshConfig = useCallback(async () => {
    try {
      if (window.electronAPI?.getConfig) {
        const cfg = await window.electronAPI.getConfig();
        setConfigState(cfg);
        if (cfg?.ui) {
          applyCssVariables(cfg.ui);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshConfig();

    if (window.electronAPI?.onConfigUpdated) {
      const unsubscribe = window.electronAPI.onConfigUpdated((updatedCfg) => {
        setConfigState(updatedCfg);
        if (updatedCfg?.ui) {
          applyCssVariables(updatedCfg.ui);
        }
      });
      return () => unsubscribe();
    }
  }, [refreshConfig]);

  const updateUI = useCallback(async (partial: Partial<UIConfig>) => {
    try {
      if (window.electronAPI?.setConfig) {
        const updated = await window.electronAPI.setConfig(partial);
        setConfigState(updated);
        if (updated?.ui) {
          applyCssVariables(updated.ui);
        }
        return updated;
      }
    } catch {
      // ignore
    }
    return null;
  }, []);

  const saveConfig = useCallback(async (fullConfig: Partial<AppConfig>) => {
    try {
      if (window.electronAPI?.saveConfig) {
        await window.electronAPI.saveConfig(fullConfig);
        await refreshConfig();
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, [refreshConfig]);

  return {
    config,
    ui: config?.ui || {},
    loading,
    refreshConfig,
    updateUI,
    saveConfig
  };
}
