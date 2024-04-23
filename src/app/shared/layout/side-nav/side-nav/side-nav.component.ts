import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmScrollAreaComponent } from '@spartan-ng/ui-scrollarea-helm';
import { SideNavContentComponent } from '../side-nav-content/side-nav-content.component';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [HlmScrollAreaComponent, SideNavContentComponent],
  host: {
    class:
      'fixed top-12 z-30 -ml-2 hidden w-full shrink-0 px-2 pb-12 pt-6 text-sm md:sticky md:block',
  },
  template: `
    <hlm-scroll-area visibility="hover" class="h-[calc(100vh-3.5rem)]">
      <app-side-nav-content />
    </hlm-scroll-area>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {}
