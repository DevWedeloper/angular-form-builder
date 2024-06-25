import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { BrnToggleDirective } from '@spartan-ng/ui-toggle-brain';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';
import { hlmMuted, hlmP } from '@spartan-ng/ui-typography-helm';
import { checkTrueOrFalse } from '../../quiz.service';
import { ControlData } from '../control-data.token';
import { TrueOrFalseControl } from '../dynamic-forms.type';
import {
  BaseDynamicControl,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from './base-dynamic-control';
import { QuizTooltipComponent } from './components/quiz-tooltip.component';

@Component({
  selector: 'app-true-or-false',
  standalone: true,
  imports: [
    ...sharedDynamicControlDeps,
    QuizTooltipComponent,
    BrnToggleDirective,
    HlmToggleDirective,
    NgClass,
  ],
  viewProviders: [dynamicControlProvider],
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    <app-quiz-card
      [index]="controlIndex"
      [totalPoints]="control.config.points"
      [showReceivedPoints]="controlSubmitted"
      [receivedPoints]="correct ? control.config.points : 0"
    >
      <p class="${hlmP}">
        {{ control.config.question }}
      </p>
      @if (control.config.note) {
        <p class="${hlmMuted}">{{ control.config.note }}</p>
      }
      <div
        [ngClass]="{
          'rounded-lg outline outline-1 outline-red-500': isInvalid()
        }"
        class="mt-2 flex flex-col gap-2"
      >
        <div class="relative">
          <button
            #trueToggle
            brnToggle
            hlm
            type="button"
            (toggled)="handleToggle(true)"
            [disabled]="controlSubmitted"
            class="w-full"
          >
            <span>True</span>
          </button>
          @if (controlSubmitted) {
            @if (isTrueAndCorrect()) {
              <app-quiz-tooltip type="exactMatch" />
            } @else if (isTrueAndIncorrect()) {
              <app-quiz-tooltip type="partialMatch" />
            } @else if (isFalseAndIncorrect()) {
              <app-quiz-tooltip type="correctButUnanswered" />
            }
          }
        </div>
        <div class="relative">
          <button
            #falseToggle
            brnToggle
            hlm
            type="button"
            (toggled)="handleToggle(false)"
            [disabled]="controlSubmitted"
            class="w-full"
          >
            <span>False</span>
          </button>
          @if (controlSubmitted) {
            @if (isFalseAndCorrect()) {
              <app-quiz-tooltip type="exactMatch" />
            } @else if (isFalseAndIncorrect()) {
              <app-quiz-tooltip type="partialMatch" />
            } @else if (isTrueAndIncorrect()) {
              <app-quiz-tooltip type="correctButUnanswered" />
            }
          }
        </div>
      </div>
    </app-quiz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrueOrFalseComponent extends BaseDynamicControl {
  protected override control = this.control as ControlData<TrueOrFalseControl>;

  private trueToggle = viewChild.required('trueToggle', {
    read: BrnToggleDirective,
  });
  private falseToggle = viewChild.required('falseToggle', {
    read: BrnToggleDirective,
  });

  protected handleToggle(value: boolean) {
    this.formControl.markAsDirty();
    this.formControl.setValue(value);
    if (value) {
      this.falseToggle().setState = 'off';
      this.trueToggle().setState = 'on';
    } else {
      this.trueToggle().setState = 'off';
      this.falseToggle().setState = 'on';
    }
  }

  protected correct = checkTrueOrFalse(
    this.control.config.correctAnswer,
    this.control.config.answer,
  );

  protected isTrueAndCorrect(): boolean {
    return this.control.config.answer === true && this.correct;
  }

  protected isFalseAndCorrect(): boolean {
    return this.control.config.answer === false && this.correct;
  }

  protected isTrueAndIncorrect(): boolean {
    return this.control.config.answer === true && !this.correct;
  }

  protected isFalseAndIncorrect(): boolean {
    return this.control.config.answer === false && !this.correct;
  }
}
