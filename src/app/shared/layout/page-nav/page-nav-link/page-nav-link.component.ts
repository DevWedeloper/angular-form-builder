import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-nav-link',
  standalone: true,
  imports: [RouterLink, NgClass],
  host: {
    class: 'mt-0 pt-2',
    role: 'listitem',
  },
  template: `
    <a
      data-testingId="link"
      [routerLink]="[]"
      [relativeTo]="activatedRoute"
      [fragment]="fragment()"
      [ngClass]="{ 'font-medium !text-foreground': active() }"
      class="inline-block rounded text-muted-foreground no-underline transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {{ label() }}
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNavLinkComponent {
  protected activatedRoute = inject(ActivatedRoute);
  fragment = input.required<string>();
  label = input.required<string>();
  active = input.required<boolean>();
}
