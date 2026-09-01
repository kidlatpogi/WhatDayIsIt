import { Tray, Menu, app } from 'electron';
import path from 'path';
import fs from 'fs';
import { WindowManager } from './window-manager';
import { IcalService } from './ical-service';

export class TrayManager {
  public tray: Tray | null = null;
  private windowManager: WindowManager;
  private icalService: IcalService;

  constructor(windowManager: WindowManager, icalService: IcalService) {
    this.windowManager = windowManager;
    this.icalService = icalService;
  }

  public setupTray(): void {
    try {
      const trayIcon = path.join(__dirname, '..', '..', 'assets', 'calendar.ico');
      if (!fs.existsSync(trayIcon)) return;

      this.tray = new Tray(trayIcon);
      this.tray.setToolTip('Calendar Widget');

      const updateMenu = () => {
        const ctxMenu = Menu.buildFromTemplate([
          {
            label: 'Show Calendar',
            click: () => {
              if (this.windowManager.win) {
                try {
                  this.windowManager.win.showInactive();
                } catch {
                  this.windowManager.win.show();
                }
              } else {
                this.windowManager.createMainWindow();
              }
            }
          },
          {
            label: 'Open Home',
            click: () => {
              this.windowManager.createHomeWindow();
            }
          },
          {
            label: 'Show/Hide Buttons',
            click: () => {
              this.windowManager.toggleCollapse();
            }
          },
          {
            label: 'Toggle Click-through',
            click: () => {
              this.windowManager.toggleClickThrough();
            }
          },
          {
            label: 'Refresh',
            click: () => {
              this.icalService.refreshAllCalendars().then(() => {
                this.icalService.notifyWindowsRefresh();
              }).catch(() => {});
            }
          },
          { type: 'separator' },
          {
            label: 'Quit',
            click: () => app.quit()
          }
        ]);

        this.tray?.setContextMenu(ctxMenu);
      };

      updateMenu();

      this.tray.on('click', () => {
        const win = this.windowManager.win;
        if (win) {
          if (win.isVisible()) {
            win.hide();
          } else {
            try {
              win.showInactive();
            } catch {
              win.show();
            }
          }
        } else {
          this.windowManager.createMainWindow();
        }
      });
    } catch {
      // ignore tray setup errors
    }
  }
}
