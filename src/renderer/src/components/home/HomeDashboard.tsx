import React, { useState, useEffect } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { DashboardTab } from './DashboardTab';
import { SettingsTab } from './SettingsTab';
import { CalendarsTab } from './CalendarsTab';
import { PrivacyTab } from './PrivacyTab';
import { LicenseTab } from './LicenseTab';
import { WelcomeModal } from './WelcomeModal';
import {
  Calendar,
  LayoutDashboard,
  Sliders,
  CalendarDays,
  ShieldCheck,
  Scale,
  Play,
  Github,
  Globe
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { config, ui, loading, updateUI, refreshConfig } = useConfig();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'calendars' | 'privacy' | 'license'>('dashboard');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!loading && config && !config.acceptedTerms) {
      setShowWelcomeModal(true);
    }
  }, [loading, config]);

  const handleAcceptTerms = async () => {
    try {
      await window.electronAPI?.acceptTerms();
      await refreshConfig();
      setShowWelcomeModal(false);
    } catch {
      alert('Failed to accept terms');
    }
  };

  const handleOpenCalendar = async () => {
    await window.electronAPI?.openMain();
  };

  const handleRefreshCalendars = async () => {
    await refreshConfig();
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

  const handleOpenGithub = () => {
    window.electronAPI?.openUrl('https://github.com/kidlatpogi');
  };

  const handleOpenPortfolio = () => {
    window.electronAPI?.openUrl('https://www.zeusbautista.site/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'settings', label: 'Customization', icon: Sliders },
    { id: 'calendars', label: 'Calendars', icon: CalendarDays },
    { id: 'privacy', label: 'Privacy & Safety', icon: ShieldCheck },
    { id: 'license', label: 'License & Terms', icon: Scale }
  ];

  return (
    <div className="min-h-screen bg-[#141313] text-white flex flex-col font-sans selection:bg-[#C44900]/30 selection:text-white">
      {/* Top Application Header Bar */}
      <header className="sticky top-0 z-30 bg-[#141313]/95 backdrop-blur-md border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#C44900] to-[#E86711] text-white shadow-md">
            <Calendar size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-tight text-white">
                Calendar Widget
              </h1>
              <span className="badge-mono text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-[#E86711] font-bold">
                v1.1.0
              </span>
            </div>
            <p className="text-[10px] text-white/50">Local-First Desktop Engine</p>
          </div>
        </div>

        {/* Quick Launch Calendar Action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenCalendar}
            className="btn-accent px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Play size={12} className="fill-current" />
            <span>Launch Widget</span>
          </button>
        </div>
      </header>

      {/* Main Container with Segmented Pill Tabs */}
      <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col space-y-6">
        {/* Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#1c1b1b] rounded-2xl border border-white/10 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#C44900] text-white shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <DashboardTab
              config={config}
              onOpenCalendar={handleOpenCalendar}
              onRefresh={handleRefreshCalendars}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              initialUI={ui}
              onSave={handleSaveSettings}
            />
          )}

          {activeTab === 'calendars' && (
            <CalendarsTab
              icals={config?.icals || []}
              onAddIcal={handleAddIcal}
              onDeleteIcal={handleDeleteIcal}
            />
          )}

          {activeTab === 'privacy' && <PrivacyTab />}

          {activeTab === 'license' && <LicenseTab />}
        </main>

        {/* Automated Copyright & Social Footer */}
        <footer className="pt-8 pb-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <div className="flex items-center gap-2 font-sans">
            <span>© {currentYear} <b>Zeus Angelo Bautista</b></span>
            <span>•</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={handleOpenGithub}
              className="flex items-center gap-1.5 text-white/70 hover:text-[#E86711] transition-colors cursor-pointer"
            >
              <Github size={14} />
              <span>GitHub</span>
            </button>

            <span>•</span>

            <button
              type="button"
              onClick={handleOpenPortfolio}
              className="flex items-center gap-1.5 text-white/70 hover:text-[#E86711] transition-colors cursor-pointer"
            >
              <Globe size={14} />
              <span>Portfolio</span>
            </button>
          </div>
        </footer>
      </div>

      {/* Welcome Onboarding Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onAccept={handleAcceptTerms}
      />
    </div>
  );
};
