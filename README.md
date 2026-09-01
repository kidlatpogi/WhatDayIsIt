# Calendar Widget

A lightweight, transparent desktop calendar overlay for Windows that synchronizes directly with Google Calendar via standard RFC 5545 iCal feeds. Engineered with a local-first architecture for absolute privacy, a sub-50MB RAM footprint, and instant desktop accessibility.

---

## Technical Overview

Calendar Widget provides an ambient, always-visible timeline of upcoming schedule events directly on the Windows desktop. All feed polling, RRULE recurrence calculations, and user preferences are executed and stored 100% locally on the client machine without any intermediary cloud proxies or behavioral tracking.

### Key Engineering Highlights

- **Local-First Privacy Architecture**: Calendar feeds are parsed and stored locally with zero external servers, telemetry trackers, or third-party analytics.
- **Hardware-Accelerated DirectComposition**: Seamless per-pixel alpha transparency on Windows DWM with hardware acceleration enabled.
- **RFC 5545 Recurrence Engine**: Robust parsing supporting `VEVENT`, complex `RRULE` (daily, weekly, monthly, yearly), `EXDATE` exclusions, and timezone normalization.
- **Real-Time Live Customization**: Changes made in the dashboard (fonts, colors, font size, clock format, day spacing) synchronize directly to the floating calendar widget in real-time.
- **Frameless Ambient Overlay**: Custom pointer-capture dragging across multiple monitors, click-through mode (`setIgnoreMouseEvents`), and taskbar-free presentation.
- **Dark & Light Mode Dashboard**: High-contrast theme switching with GSAP magnetic HUD bracket cursor targeting.
- **System Tray Integration**: Native Windows system tray support for quick toggling, click-through activation, manual refresh, and settings management.

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Electron 34 | Cross-platform desktop runtime with secure Context Isolation |
| **Language** | TypeScript 5 | Strict end-to-end type safety across Main, Preload, and Renderer |
| **Frontend UI** | React 18 | Declarative state management and virtual DOM rendering |
| **Styling** | Tailwind CSS & PostCSS | Atomic design system, CSS custom properties, and theme switching |
| **Animations** | GSAP 3 | High-performance magnetic HUD bracket target cursor |
| **Bundler** | Vite 6 | Rapid HMR development server and optimized production packaging |
| **Distribution** | electron-builder | Windows NSIS installer and portable executable generation |

---

## Visual Showcase

<!-- Showcase placeholders ready for updated screenshots and demo GIFs -->

### Desktop Timeline Overlay
*Ambient, transparent floating widget with real-time digital clock, color-coded event states, and smooth drag repositioning.*

<!-- [IMAGE PLACEHOLDER: Desktop Timeline Overlay] -->

---

### Dashboard & Control Center
*Centralized management console featuring live customization, iCal feed provisioning, interactive ATS tutorial guide, and security disclosures in both Dark and Light modes.*

<!-- [IMAGE PLACEHOLDER: Management Dashboard] -->

---

### Interactive Demonstrations
*Real-time desktop reactivity, window dragging across displays, and click-through mode.*

<!-- [GIF PLACEHOLDER: Desktop Interaction & Live Customization] -->

---

## Keyboard Shortcuts & Operations

| Shortcut | Action | Description |
| :---: | :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd> | **Toggle Collapse** | Hides Home & Refresh buttons for a minimal, distraction-free floating timeline |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> | **Toggle Click-Through** | Passes mouse click events directly through the widget to underlying desktop windows |
| **Right-Click / Double-Click** | **Mark Completed** | Toggles strikethrough completion state on calendar tasks with local persistence |

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
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

# Start the application in development mode
npm start
```

### Packaging Production Installer

```bash
# Package the Windows NSIS installer (.exe) for x64
npm run dist
```

The output installer will be generated in the `dist/` directory as `Calendar Widget Setup 1.1.0.exe`.

---

## Project Structure

```
Schedule-Widget-Electron/
├── assets/                          # Application icons, TTF typography, and NSIS scripts
│   ├── Fonts/                       # Home Video & LED Dot-Matrix font assets
│   ├── calendar.ico                 # Application window & tray icon
│   └── uninstaller.nsh              # NSIS registry and config cleanup script
├── src/
│   ├── main/                        # Electron Main Process (Node.js runtime)
│   │   ├── index.ts                 # Lifecycle, single-instance lock, GPU flags
│   │   ├── window-manager.ts        # Transparent DirectComposition window creation
│   │   ├── config-manager.ts        # Typed configuration persistence (%APPDATA%)
│   │   ├── ical-service.ts          # RFC 5545 parser, recurrence expansion, ETag caching
│   │   ├── tray-manager.ts          # Native Windows tray icon & context menus
│   │   └── ipc-handlers.ts          # Type-safe IPC channels & live broadcast
│   ├── preload/                     # Electron Preload Script (Context Bridge)
│   │   └── index.ts                 # Secure window.electronAPI exposed to renderer
│   ├── renderer/                    # React 18 + Tailwind CSS + Vite Frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/          # TargetCursor (GSAP magnetic bracket)
│   │   │   │   ├── home/            # DashboardTab, SettingsTab, CalendarsTab, TutorialTab, PrivacyTab, LicenseTab, WelcomeModal
│   │   │   │   └── widget/          # WidgetView, ClockHeader, EventItem, WidgetControls
│   │   │   ├── hooks/               # useConfig, useEvents
│   │   │   ├── utils/               # Color conversion, date parsing, CSS variables
│   │   │   ├── App.tsx              # View router (Main Widget vs Home Dashboard)
│   │   │   ├── main.tsx             # React entry point
│   │   │   └── index.css            # Design tokens, theme variables, scrollbars
│   │   └── index.html               # Semantic HTML entry with SEO meta tags & CSP
│   └── types/                       # Shared TypeScript definitions (AppConfig, UIConfig, CalendarEvent)
├── package.json                     # Project scripts and dependencies
├── tsconfig.json                    # Renderer TypeScript configuration
├── tsconfig.electron.json           # Main & Preload TypeScript configuration
├── vite.config.ts                   # Vite bundler configuration
└── tailwind.config.js               # Tailwind CSS theme configuration
```

---

## License

This project is licensed under the custom MIT License with Attribution Requirement.

```text
Copyright (c) 2026 Zeus Angelo Bautista

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

1. The Software may not be sold or included in any commercial product or service
   without prior written permission.
2. If you modify, redistribute, or reuse any part of this Software, you must
   give clear credit to the original author: Zeus Angelo Bautista.
3. The above copyright notice and this permission notice shall be included
   in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
