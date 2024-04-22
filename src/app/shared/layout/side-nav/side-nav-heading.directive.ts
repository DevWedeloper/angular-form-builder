import { Directive } from '@angular/core';

@Directive({
  selector: '[spartanSideNavHeading]',
  standalone: true,
  host: {
    class:
      'mb-1 flex items-center justify-between rounded-md px-2 py-1 font-semibold',
  },
})
export class SideNavHeadingDirective {}
