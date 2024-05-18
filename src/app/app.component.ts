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
      <div
        class="mx-auto flex w-full flex-1 items-start px-4 sm:px-8 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"
      >
        <app-side-nav />
        <main
          class="sticky top-0 w-full py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[minmax(0,1fr)_280px]"
        >
          <div class="px-2">
            <router-outlet />
          </div>
          <app-page-nav-outlet />
        </main>
      </div>
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
