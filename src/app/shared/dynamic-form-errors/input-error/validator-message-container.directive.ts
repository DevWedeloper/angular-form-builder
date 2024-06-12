import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[validatorMessageContainerDirective]',
  standalone: true,
  exportAs: 'validatorMessageContainerDirective',
})
export class ValidatorMessageContainerDirective {
  container = inject(ViewContainerRef);
}
