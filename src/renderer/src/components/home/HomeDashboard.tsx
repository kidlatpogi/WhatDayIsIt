import React, { useState, useEffect } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { DashboardTab } from './DashboardTab';
import { SettingsTab } from './SettingsTab';
import { CalendarsTab } from './CalendarsTab';
import { TutorialTab } from './TutorialTab';
import { PrivacyTab } from './PrivacyTab';
import { LicenseTab } from './LicenseTab';
import { WelcomeModal } from './WelcomeModal';
import { TargetCursor } from '../common/TargetCursor';
import {
  LayoutDashboard,
  Sliders,
  CalendarDays,
  BookOpen,
  ShieldCheck,
  Scale,
  Play,
  Sun,
  Moon,
  Github,
  Globe
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { config, ui, loading, updateUI, refreshConfig } = useConfig();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'calendars' | 'tutorial' | 'privacy' | 'license'>('dashboard');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('menu_theme') as 'dark' | 'light') || 'dark';
  });

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    localStorage.setItem('menu_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!loading && config && !config.acceptedTerms) {
      setShowWelcomeModal(true);
    }
  }, [loading, config]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

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
    { id: 'tutorial', label: 'Tutorial Guide', icon: BookOpen },
    { id: 'privacy', label: 'Privacy & Safety', icon: ShieldCheck },
    { id: 'license', label: 'License & Terms', icon: Scale }
  ];

  return (
    <div
      className={`relative min-h-screen h-screen overflow-y-auto flex flex-col font-sans selection:bg-[#C44900]/30 selection:text-white transition-colors duration-200 ${
        theme === 'light' ? 'theme-light' : 'theme-dark'
      }`}
      style={{ backgroundColor: 'var(--menu-bg)', color: 'var(--menu-text-primary)' }}
    >
      {/* Dynamic TargetCursor HUD Bracket (White in DarkMode, Black in LightMode) */}
      <TargetCursor targetSelector=".cursor-target" spinDuration={6} theme={theme} />

      {/* Top Application Header Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-sm transition-colors duration-200"
        style={{
          backgroundColor: 'var(--menu-header-bg)',
          borderBottom: '1px solid var(--menu-divider)'
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold tracking-tight" style={{ color: 'var(--menu-text-primary)' }}>
              Calendar Widget
            </h1>
            <span className="badge-mono text-[9px] px-1.5 py-0.5 rounded font-bold text-[#E86711] bg-[#C44900]/15">
              v1.1.0
            </span>
          </div>
          <p className="text-[10px]" style={{ color: 'var(--menu-text-muted)' }}>
            Local-First Desktop Engine
          </p>
        </div>

        {/* Quick Launch & Theme Switcher Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="btn-surface p-2 rounded-xl text-xs flex items-center justify-center cursor-target cursor-pointer transition-colors"
          >
            {theme === 'dark' ? <Sun size={15} className="text-[#FF9436]" /> : <Moon size={15} className="text-slate-800" />}
          </button>

          <button
            type="button"
            onClick={handleOpenCalendar}
            aria-label="Launch Calendar Widget"
            className="btn-accent px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-target shadow-md cursor-pointer"
          >
            <Play size={13} className="fill-current" />
            <span>Launch Widget</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col space-y-6">
        {/* Navigation Pill Bar - Centered */}
        <nav
          aria-label="Main Navigation"
          className="flex items-center justify-center gap-1.5 p-1.5 mx-auto rounded-2xl overflow-x-auto shadow-sm transition-colors duration-200 max-w-full"
          style={{
            backgroundColor: 'var(--menu-nav-bg)',
            border: '1px solid var(--menu-nav-border)'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                aria-pressed={isActive}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-target cursor-pointer ${
                  isActive
                    ? 'bg-[#C44900] text-white shadow-md'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{
                  color: isActive ? '#ffffff' : 'var(--menu-text-secondary)'
                }}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Content Rendering with Smooth Scrolling */}
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

          {activeTab === 'tutorial' && <TutorialTab />}

          {activeTab === 'privacy' && <PrivacyTab />}

          {activeTab === 'license' && <LicenseTab />}
        </main>

        {/* Dynamic Copyright Footer */}
        <footer
          className="pt-8 pb-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 transition-colors duration-200"
          style={{
            borderTop: '1px solid var(--menu-divider)',
            color: 'var(--menu-text-muted)'
          }}
        >
          <div className="flex items-center gap-2 font-sans">
            <span>© {currentYear} <b>Zeus Angelo Bautista</b></span>
            <span>•</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={handleOpenGithub}
              aria-label="GitHub Repository"
              className="flex items-center gap-1.5 hover:text-[#E86711] transition-colors cursor-target cursor-pointer"
              style={{ color: 'var(--menu-text-secondary)' }}
            >
              <Github size={14} />
              <span>GitHub</span>
            </button>

            <span>•</span>

            <button
              type="button"
              onClick={handleOpenPortfolio}
              aria-label="Developer Portfolio"
              className="flex items-center gap-1.5 hover:text-[#E86711] transition-colors cursor-target cursor-pointer"
              style={{ color: 'var(--menu-text-secondary)' }}
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
