import { inject, Injector, Pipe, PipeTransform } from '@angular/core';
import { CONTROL_DATA } from './control-data.token';
import { CONTROL_INDEX } from './control-index.token';
import { CONTROL_SUBMITTED } from './control-submitted.token';
import { QuizControl } from './dynamic-forms.type';

@Pipe({
  name: 'controlInjector',
  standalone: true,
})
export class ControlInjectorPipe implements PipeTransform {
  private injector = inject(Injector);

  transform(
    controlKey: string,
    config: QuizControl,
    index: number,
    submitted?: boolean,
  ): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: CONTROL_DATA,
          useValue: { controlKey, config },
        },
        {
          provide: CONTROL_INDEX,
          useValue: index,
        },
        {
          provide: CONTROL_SUBMITTED,
          useValue: submitted,
        },
      ],
    });
  }
}
