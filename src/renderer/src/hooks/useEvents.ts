import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '../../../types';

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (window.electronAPI?.fetchEvents) {
        const fetched = await window.electronAPI.fetchEvents();
        setEvents(fetched || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();

    if (window.electronAPI?.onRefresh) {
      const unsubscribe = window.electronAPI.onRefresh(() => {
        loadEvents();
      });
      return () => unsubscribe();
    }
  }, [loadEvents]);

  return {
    events,
    loading,
    error,
    refreshEvents: loadEvents
  };
}
