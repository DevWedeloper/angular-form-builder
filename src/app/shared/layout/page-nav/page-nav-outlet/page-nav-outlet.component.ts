import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  TemplateRef,
} from '@angular/core';

export const pageNavTemplate = signal<TemplateRef<unknown> | null>(null);

@Component({
  selector: 'app-page-nav-outlet',
  standalone: true,
  imports: [NgTemplateOutlet],
  host: {
    class:
      'sticky top-14 -mt-10 hidden h-[calc(100vh-3.5rem)] pt-6 text-sm xl:block',
  },
  template: `
    <ng-container [ngTemplateOutlet]="pageNavTemplate()"></ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNavOutletComponent {
  protected pageNavTemplate = pageNavTemplate.asReadonly();
}
