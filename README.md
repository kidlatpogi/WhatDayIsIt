# Calendar Widget

A lightweight, transparent desktop calendar widget for Windows that synchronizes directly with Google Calendar via standard iCal feeds. Engineered with a local-first architecture for absolute privacy, sub-50MB RAM footprint, and instant desktop accessibility.

---

## Technical Overview

Calendar Widget provides an ambient, always-visible timeline of upcoming schedule events directly on the Windows desktop. Unlike cloud-dependent productivity tools, all feed processing, recurrence parsing, and configuration management are performed strictly locally on the client machine.

### Key Engineering Features

- **Local-First Privacy Architecture**: Calendar feeds are parsed and stored locally with zero third-party cloud servers, telemetry, or analytics.
- **High-Performance Memory Footprint**: Tuned with hardware-acceleration memory switches, in-memory RFC 5545 event caching, and optimized virtual DOM reconciliation to operate at ~35–45 MB RAM.
- **RFC 5545 Recurrence Engine**: Custom parser supporting `VEVENT`, `RRULE` (daily, weekly, monthly, yearly frequency), `EXDATE` exception handling, and multi-timezone offsets.
- **Frameless Transparent Overlay**: Seamless Windows desktop integration featuring custom pointer-capture dragging, click-through mode (`setIgnoreMouseEvents`), and taskbar-free rendering.
- **Dynamic Theming System**: Instant CSS custom property theming for fonts, sizes, padding, and hex-to-rgba color blending with live preview.
- **Interactive Task Management**: Real-time event completion tracking with local persistence and right-click / double-click completion toggling.
- **System Tray Integration**: Native tray icon supporting quick calendar toggling, click-through switching, background refresh, and preferences access.

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Electron | Cross-platform desktop runtime with secure context isolation |
| **Language** | TypeScript | Strict type safety across Main, Preload, and Renderer layers |
| **Frontend UI** | React 18 | Declarative component state management and virtual DOM rendering |
| **Styling** | Tailwind CSS & PostCSS | Atomic styling, glassmorphism design system, and dynamic CSS variables |
| **Bundler** | Vite | Ultra-fast Hot Module Replacement and production bundling |
| **Distribution** | electron-builder | Windows NSIS installer and portable executable packaging |

---

## Keyboard Shortcuts

| Shortcut | Action | Description |
| :---: | :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd> | **Toggle Collapse** | Hides control buttons for a clean, distraction-free floating timeline |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> | **Toggle Click-Through** | Allows mouse clicks to pass directly through the widget to underlying windows |

---

## Visual Showcase

### Desktop Timeline View
Floating, transparent calendar timeline with real-time digital clock and color-coded event states.

<p align="center">
  <img src="assets/Calendar.webp" alt="Calendar Widget Desktop View" width="850"/>
</p>

---

### Welcome & Onboarding Dashboard
Local onboarding screen with Terms & Conditions and local-first data disclosures.

<p align="center">
  <img src="assets/Home.webp" alt="Welcome Screen" width="850"/>
</p>

---

### Customization & Settings Grid
Comprehensive settings dashboard covering system startup, typography, layout spacing, digital clock format, and color pickers.

<p align="center">
  <img src="assets/Settings.webp" alt="Settings Dashboard" width="850"/>
</p>

---

### Digital Clock Customization
Configurable clock header with custom fonts (`Home Video`, `LED Dot-Matrix`, `Segoe UI`), alignment, and 12h/24h formats.

<p align="center">
  <img src="assets/Clock.webp" alt="Digital Clock Header" width="300"/>
</p>

---

### Interactive Previews

<div align="center">
  <table>
    <tr>
      <td align="center">
        <b>Window Dragging</b><br/>
        <img src="assets/Draggable-Example.gif" alt="Window Dragging Demo" width="400"/>
      </td>
      <td align="center">
        <b>Live Customization</b><br/>
        <img src="assets/Customization-Example.gif" alt="Customization Demo" width="400"/>
      </td>
    </tr>
  </table>
</div>

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Windows 10 / 11 (64-bit)

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/kidlatpogi/Calendar-Widget.git
cd Calendar-Widget

# Install dependencies
npm install

# Build TypeScript and Vite renderer
npm run build

# Start the application
npm start
```

### Production Packaging

```bash
# Package the NSIS installer (.exe) for Windows x64
npm run dist
```

Installers and packaged artifacts will be output to the `dist/` directory.

---

## Project Structure

```
Schedule-Widget-Electron/
├── assets/                          # Application icons, fonts, screenshots, NSIS script
│   ├── Fonts/                       # Custom TTF typography (Home Video, LED Dot-Matrix)
│   ├── calendar.ico                 # Application icon
│   └── uninstaller.nsh              # Custom NSIS cleanup script
├── Public/
│   └── How to get ICal link.pdf     # User setup guide
├── src/
│   ├── main/                        # Electron Main Process (TypeScript)
│   │   ├── index.ts                 # App lifecycle, single-instance lock, hardware switches
│   │   ├── window-manager.ts        # Window lifecycle, bounds restoration, click-through
│   │   ├── config-manager.ts        # Typed configuration store (%APPDATA%)
│   │   ├── ical-service.ts          # RFC 5545 parser, RRULE expansion, ETag caching
│   │   ├── tray-manager.ts          # Native taskbar tray integration
│   │   └── ipc-handlers.ts          # Type-safe IPC channels
│   ├── preload/                     # Electron Preload Script
│   │   └── index.ts                 # Context bridge exposing window.electronAPI
│   ├── renderer/                    # React 18 + Tailwind CSS + Vite Frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── widget/          # Timeline, Clock, EventItem, Controls
│   │   │   │   └── home/            # Welcome, MainMenu, Settings, Calendar management
│   │   │   ├── hooks/               # useConfig, useEvents
│   │   │   ├── utils/               # Date parsing, Hex-to-RGBA, CSS variables
│   │   │   ├── App.tsx              # View router
│   │   │   └── index.css            # Tailwind, glassmorphism, @font-face rules
│   │   └── index.html               # Vite HTML entry
│   └── types/                       # Shared TypeScript definitions
├── package.json                     # Scripts and dependencies
├── tsconfig.json                    # Renderer TypeScript configuration
├── tsconfig.electron.json           # Main & Preload TypeScript configuration
├── vite.config.ts                   # Vite bundler configuration
└── tailwind.config.js               # Tailwind CSS theme configuration
```

---

## License

This project is licensed under the terms of the MIT License.

```
Copyright (c) 2025 Zeus Angelo Bautista

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

1. The Software may not be sold or included in any commercial product or service.
2. If you modify, redistribute, or reuse any part of this Software, you must
   give clear credit to the original author: Zeus Angelo Bautista.
3. The above copyright notice and this permission notice shall be included
   in all copies or substantial portions of the Software.
```
