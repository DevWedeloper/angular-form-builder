import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ValidatorMessageContainerDirective]',
  standalone: true,
  exportAs: 'ValidatorMessageContainerDirective',
})
export class ValidatorMessageContainerDirective {
  container = inject(ViewContainerRef);
}
