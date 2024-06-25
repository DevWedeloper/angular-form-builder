import { KeyValue } from '@angular/common';
import { Directive, StaticProvider, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, startWith, take } from 'rxjs';
import { ErrorStateMatcherService } from '../../../../shared/dynamic-form-errors/input-error/error-state-matcher.service';
import { controls } from '../../quiz-nav/quiz-nav.component';
import { QuizService } from '../../quiz.service';
import { CONTROL_DATA } from '../control-data.token';
import { CONTROL_INDEX } from '../control-index.token';
import { CONTROL_SUBMITTED } from '../control-submitted.token';
import { QuizControl } from '../dynamic-forms.type';
import { QuizCardComponent } from './components/quiz-card.component';

export const comparatorFn = (
  a: KeyValue<string, QuizControl>,
  b: KeyValue<string, QuizControl>,
): number => a.value.order - b.value.order;

export const sharedDynamicControlDeps = [
  ReactiveFormsModule,
  QuizCardComponent,
];

export const dynamicControlProvider: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => inject(ControlContainer, { skipSelf: true }),
};

@Directive()
export class BaseDynamicControl {
  protected controlSubmitted = inject(CONTROL_SUBMITTED);

  protected controlIndex = inject(CONTROL_INDEX);

  protected control = inject(CONTROL_DATA);

  private currentIndexes = inject(QuizService).currentIndexes;
  private isVisible = computed(() =>
    this.currentIndexes().includes(this.controlIndex),
  );
  protected computedClass = computed(() =>
    this.isVisible() ? 'mb-4 block' : 'hidden',
  );

  protected formControl: AbstractControl = new FormControl(
    this.control.config.answer,
    Validators.required,
  );

  private parentGroupDir = inject(ControlContainer);

  private errorStateMatcher = inject(ErrorStateMatcherService);

  protected isInvalid = toSignal(
    this.formControl.statusChanges.pipe(
      map(() => this.errorStateMatcher.isErrorVisible(this.formControl, null)),
    ),
    {
      initialValue: false,
    },
  );

  private quizNavControls = controls;

  constructor() {
    (this.parentGroupDir.control as FormGroup).addControl(
      this.control.controlKey,
      this.formControl,
    );
    if (this.controlSubmitted) {
      this.formControl.disable();
    }
    this.formControl.statusChanges
      .pipe(startWith(this.formControl.status), takeUntilDestroyed())
      .subscribe((status) => {
        const controlExists = this.quizNavControls().some(
          (control) => control.index === this.controlIndex,
        );
        if (controlExists) {
          this.quizNavControls.update((items) =>
            items.map((item) =>
              item.index === this.controlIndex ? { ...item, status } : item,
            ),
          );
        } else {
          this.quizNavControls.update((items) => [
            ...items,
            { index: this.controlIndex, status, dirty: this.formControl.dirty },
          ]);
        }
      });
    this.formControl.valueChanges.pipe(take(1)).subscribe(() => {
      this.quizNavControls.update((items) =>
        items.map((item) =>
          item.index === this.controlIndex
            ? { ...item, dirty: this.formControl.dirty }
            : item,
        ),
      );
    });
  }
}
