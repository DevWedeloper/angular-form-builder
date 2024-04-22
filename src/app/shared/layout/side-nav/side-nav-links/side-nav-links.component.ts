import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-side-nav-links',
  standalone: true,
  host: {
    tabindex: '-1',
    class: 'grid grid-flow-row auto-rows-max',
  },
  template: '<ng-content/>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavLinksComponent {}
