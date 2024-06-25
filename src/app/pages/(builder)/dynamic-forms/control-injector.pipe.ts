import { inject, Injector, Pipe, PipeTransform } from '@angular/core';
import { CONTROL_DATA } from './control-data.token';
import { CONTROL_PATH } from './control-path.token';
import { DynamicControl } from './dynamic-forms.type';

@Pipe({
  name: 'controlInjector',
  standalone: true,
})
export class ControlInjectorPipe implements PipeTransform {
  private injector = inject(Injector);

  transform(
    controlKey: string,
    config: DynamicControl,
    controlPath: string,
  ): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: CONTROL_DATA,
          useValue: { controlKey, config },
        },
        {
          provide: CONTROL_PATH,
          useValue: controlPath,
        },
      ],
    });
  }
}
