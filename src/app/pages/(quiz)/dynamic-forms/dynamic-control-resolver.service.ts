import { Injectable, Type } from '@angular/core';
import { from, of, tap } from 'rxjs';
import { QuizControl } from './dynamic-forms.type';

type QuizControlMap = {
  [T in QuizControl['controlType']]: () => Promise<Type<unknown>>;
};

@Injectable({
  providedIn: 'root',
})
export class DynamicControlResolverService {
  private lazyControlComponents: QuizControlMap = {
    identification: () =>
      import('./dynamic-controls/identification.component').then(
        (c) => c.IdentificationComponent,
      ),
    trueOrFalse: () =>
      import('./dynamic-controls/true-or-false.component').then(
        (c) => c.TrueOrFalseComponent,
      ),
    multipleChoice: () =>
      import('./dynamic-controls/multiple-choice.component').then(
        (c) => c.MultipleChoiceComponent,
      ),
    essay: () =>
      import('./dynamic-controls/essay.component').then(
        (c) => c.EssayComponent,
      ),
  };
  private loadedControlComponents = new Map<string, Type<any>>();

  resolve(controlType: keyof QuizControlMap) {
    const loadedComponent = this.loadedControlComponents.get(controlType);
    if (loadedComponent) {
      return of(loadedComponent);
    }
    return from(this.lazyControlComponents[controlType]()).pipe(
      tap((comp) => this.loadedControlComponents.set(controlType, comp)),
    );
  }
}
