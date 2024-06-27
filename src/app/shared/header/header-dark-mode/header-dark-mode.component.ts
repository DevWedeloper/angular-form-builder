import { CdkMenuTrigger } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { provideIcons } from '@ng-icons/core';
import { lucideMoon } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmMenuComponent, HlmMenuImports } from '@spartan-ng/ui-menu-helm';
import { DarkMode, ThemeService } from '../../theme/theme.service';

@Component({
  selector: 'app-dark-mode',
  standalone: true,
  imports: [
    CdkMenuTrigger,
    HlmMenuImports,
    HlmButtonDirective,
    HlmIconComponent,
    HlmMenuComponent,
  ],
  providers: [provideIcons({ lucideMoon })],
  template: `
    <button
      data-testingId="menu-trigger"
      size="sm"
      variant="ghost"
      align="end"
      [cdkMenuTriggerFor]="themeTpl"
      hlmBtn
    >
      <hlm-icon name="lucideMoon" size="sm" />
      <span class="sr-only">Open menu to change theme</span>
    </button>
    <ng-template #themeTpl>
      <hlm-menu class="w-40">
        <button
          data-testingId="light"
          hlmMenuItemCheckbox
          [checked]="theme() === 'light'"
          (click)="setTheme('light')"
        >
          <hlm-menu-item-check />
          Light
        </button>
        <button
          data-testingId="dark"
          hlmMenuItemCheckbox
          [checked]="theme() === 'dark'"
          (click)="setTheme('dark')"
        >
          <hlm-menu-item-check />
          Dark
        </button>
        <button
          data-testingId="system"
          hlmMenuItemCheckbox
          [checked]="theme() === 'system'"
          (click)="setTheme('system')"
        >
          <hlm-menu-item-check />
          System
        </button>
      </hlm-menu>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderDarkModeComponent {
  private _themeService = inject(ThemeService);
  protected theme = toSignal(this._themeService.darkMode$);
  protected setTheme(theme: DarkMode) {
    this._themeService.setDarkMode(theme);
  }
}
