import { Directive } from '@angular/core';

@Directive({
  selector: '[appCodePreview]',
  standalone: true,
  host: {
    class: 'flex min-h-[350px] w-full items-center justify-center p-10',
  },
})
export class CodePreviewDirective {}
