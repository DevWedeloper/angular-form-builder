import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { SideNavHeadingDirective } from '../side-nav-heading.directive';
import { SideNavLinkDirective } from '../side-nav-link/side-nav-link.directive';
import { SideNavLinksComponent } from '../side-nav-links/side-nav-links.component';

@Component({
  selector: 'app-side-nav-content',
  standalone: true,
  imports: [
    SideNavLinkDirective,
    SideNavLinksComponent,
    SideNavHeadingDirective,
  ],
  host: {
    class: 'block px-1',
  },
  template: `
    <div class="pb-4">
      <h4 appSideNavHeading>Dynamic Forms</h4>
      <app-side-nav-links>
        <a
          data-testingId="link"
          (click)="linkClicked.emit()"
          appSideNavLink="builder"
        >
          Builder
        </a>
        <a (click)="linkClicked.emit()" appSideNavLink="guide">Guide</a>
        <a (click)="linkClicked.emit()" appSideNavLink="quiz">Quiz</a>
      </app-side-nav-links>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavContentComponent {
  linkClicked = output();
}
