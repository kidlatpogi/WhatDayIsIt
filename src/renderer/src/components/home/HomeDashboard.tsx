import React, { useState, useEffect } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { WelcomeView } from './WelcomeView';
import { MainMenuView } from './MainMenuView';
import { SettingsView } from './SettingsView';
import { AddCalendarView } from './AddCalendarView';
import { ManageCalendarsView } from './ManageCalendarsView';
import { TermsModal } from './TermsModal';
import { Footer } from './Footer';

type ViewMode = 'welcome' | 'main-menu' | 'settings' | 'add-calendar' | 'manage-calendars';

export const HomeDashboard: React.FC = () => {
  const { config, ui, loading, updateUI, refreshConfig } = useConfig();
  const [currentView, setCurrentView] = useState<ViewMode>('welcome');
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  useEffect(() => {
    if (!loading && config) {
      if (config.acceptedTerms) {
        setCurrentView('main-menu');
      } else {
        setCurrentView('welcome');
      }
    }
  }, [loading, config?.acceptedTerms]);

  const handleAcceptTerms = async () => {
    try {
      await window.electronAPI?.acceptTerms();
      await refreshConfig();
      setCurrentView('main-menu');
    } catch {
      alert('Failed to accept terms');
    }
  };

  const handleOpenCalendar = async () => {
    await window.electronAPI?.openMain();
  };

  const handleAddIcal = async (url: string) => {
    if (window.electronAPI?.addIcal) {
      await window.electronAPI.addIcal(url);
      await refreshConfig();
    }
  };

  const handleDeleteIcal = async (url: string) => {
    if (window.electronAPI?.removeIcal) {
      await window.electronAPI.removeIcal(url);
      await refreshConfig();
    }
  };

  const handleSaveSettings = async (settings: any) => {
    await updateUI(settings);
  };

  return (
    <div className="min-h-screen bg-darkBg text-white flex items-center justify-center p-4">
      <div className="w-full max-w-[800px] flex flex-col justify-center">
        <div className="text-center mb-3">
          <h1 className="text-lg font-bold tracking-tight text-white/90">Calendar Widget</h1>
        </div>

        {currentView === 'welcome' && (
          <WelcomeView
            onAccept={handleAcceptTerms}
            onOpenTerms={() => setIsTermsOpen(true)}
          />
        )}

        {currentView === 'main-menu' && (
          <MainMenuView
            onOpenCalendar={handleOpenCalendar}
            onOpenSettings={() => setCurrentView('settings')}
            onOpenAddCalendar={() => setCurrentView('add-calendar')}
            onOpenManageCalendars={() => setCurrentView('manage-calendars')}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            initialUI={ui}
            onSave={handleSaveSettings}
            onCancel={() => setCurrentView('main-menu')}
          />
        )}

        {currentView === 'add-calendar' && (
          <AddCalendarView
            icals={config?.icals || []}
            onAddIcal={handleAddIcal}
            onDeleteIcal={handleDeleteIcal}
            onBack={() => setCurrentView('main-menu')}
          />
        )}

        {currentView === 'manage-calendars' && (
          <ManageCalendarsView
            icals={config?.icals || []}
            onDeleteIcal={handleDeleteIcal}
            onBack={() => setCurrentView('main-menu')}
          />
        )}

        <Footer />

        <TermsModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
        />
      </div>
    </div>
  );
};
