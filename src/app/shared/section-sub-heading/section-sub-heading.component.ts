import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'app-section-sub-heading',
  standalone: true,
  host: {
    class: 'block pb-2',
    '[class.-mt-12]': 'first()',
  },
  template: `
    <h2
      data-testingId="sub-heading"
      class="font-heading border-b border-border pt-12 text-2xl font-semibold tracking-tight"
    >
      <ng-content />
    </h2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionSubHeadingComponent {
  first = input(false, {
    transform: booleanAttribute,
  });
}
