import { Component, input } from '@angular/core';
import { hlmLead } from '@spartan-ng/ui-typography-helm';

@Component({
  selector: 'app-section-intro',
  standalone: true,
  host: {
    class: 'mb-8 block space-y-2',
  },
  template: `
    <h1
      data-testingId="name"
      class="scroll-m-20 text-4xl font-bold tracking-tight"
    >
      {{ name() }}
    </h1>
    <p data-testingId="lead" class="${hlmLead}">{{ lead() }}</p>
  `,
})
export class SectionIntroComponent {
  name = input.required<string>();
  lead = input.required<string>();
}
