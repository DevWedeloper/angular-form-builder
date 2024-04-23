import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { NavLinkDirective } from '../nav-link.directive';
import { HeaderDarkModeComponent } from './header-dark-mode.component';
import { HeaderMobileNavComponent } from './header-mobile-nav.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HlmButtonDirective,
    RouterLink,
    HlmIconComponent,
    NavLinkDirective,
    HeaderMobileNavComponent,
    HeaderDarkModeComponent,
  ],
  host: {
    class:
      'bg-blur-lg sticky top-0 z-40 block w-full border-b border-border bg-background/95 p-2 sm:px-4',
  },
  template: `
    <div
      class="mx-auto flex w-full max-w-screen-xl items-center justify-between"
    >
      <nav class="flex items-center">
        <app-mobile-nav class="sm:hidden" />
      </nav>

      <div class="flex space-x-2">
        <app-dark-mode />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
