import { Directive } from '@angular/core';

@Directive({
  selector: '[appMainSection]',
  standalone: true,
  host: {
    class: 'flex min-h-[calc(100vh-3.5rem)] w-full flex-col p-1 sm:p-0',
  },
})
export class MainSectionDirective {}
