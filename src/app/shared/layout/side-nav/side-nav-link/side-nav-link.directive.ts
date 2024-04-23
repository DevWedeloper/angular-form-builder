import { booleanAttribute, Directive, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Directive({
  selector: '[appSideNavLink]',
  standalone: true,
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: ['routerLink: appSideNavLink'],
    },
    RouterLinkActive,
  ],
  host: {
    '[tabindex]': 'disabled() ? "-1" : "0"',
    '[class.!text-zinc-300]': 'disabled()',
    '[class.dark:!text-zinc-700]': 'disabled()',
    '[class.pointer-events-none]': 'disabled()',
    class:
      'group relative flex w-full items-center justify-between rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  },
})
export class SideNavLinkDirective {
  private _rlActive = inject(RouterLinkActive);
  disabled = input(false, {
    transform: booleanAttribute,
  });

  constructor() {
    this._rlActive.routerLinkActive = 'font-medium !text-foreground';
  }
}
