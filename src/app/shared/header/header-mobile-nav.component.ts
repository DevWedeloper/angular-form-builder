import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideX } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmScrollAreaComponent } from '@spartan-ng/ui-scrollarea-helm';
import {
  BrnSheetContentDirective,
  BrnSheetTriggerDirective,
} from '@spartan-ng/ui-sheet-brain';
import { HlmSheetImports } from '@spartan-ng/ui-sheet-helm';
import { SideNavContentComponent } from '../layout/side-nav/side-nav-content/side-nav-content.component';
import { SideNavLinkDirective } from '../layout/side-nav/side-nav-link/side-nav-link.directive';
import { NavLinkDirective } from '../nav-link/nav-link.directive';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    HlmSheetImports,
    HlmButtonDirective,
    HlmIconComponent,
    SideNavContentComponent,
    HlmScrollAreaComponent,
    RouterLink,
    NavLinkDirective,
    SideNavLinkDirective,
  ],
  providers: [provideIcons({ lucideMenu, lucideX })],
  template: `
    <hlm-sheet side="left" closeDelay="100">
      <button
        size="sm"
        id="menu-trigger"
        variant="ghost"
        brnSheetTrigger
        hlmBtn
      >
        <hlm-icon name="lucideMenu" size="sm" />
        <span class="sr-only">Open menu</span>
      </button>
      <hlm-sheet-content class="pb-0 pr-0" *brnSheetContent="let ctx">
        <button hlmSheetClose>
          <span class="sr-only">Close</span>
          <hlm-icon class="flex h-4 w-4" name="lucideX" />
        </button>
        <div class="flex items-center pb-2"></div>
        <hlm-scroll-area class="h-[calc(100vh-8rem)]">
          <div class="flex flex-col space-y-1 p-2 pb-4"></div>
          <app-side-nav-content (linkClicked)="ctx.close()" />
        </hlm-scroll-area>
      </hlm-sheet-content>
    </hlm-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderMobileNavComponent {}
