import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { PageNavOutletComponent } from './shared/layout/page-nav/page-nav-outlet/page-nav-outlet.component';
import { SideNavComponent } from './shared/layout/side-nav/side-nav/side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  host: {
    class: 'text-foreground block antialiased',
  },
  template: `
    <app-header />
    <div class="mx-auto max-w-screen-2xl">
      <app-side-nav />
      <main
        class="sticky top-0 overflow-hidden py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[minmax(0,1fr)_280px]"
      >
        <div class="px-2">
          <router-outlet />
        </div>
        <app-page-nav-outlet />
      </main>
    </div>
    <app-footer />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    PageNavOutletComponent,
  ],
})
export class AppComponent {
  title = 'angular-form-builder';
}
