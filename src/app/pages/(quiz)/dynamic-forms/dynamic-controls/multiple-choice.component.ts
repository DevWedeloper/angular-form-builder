import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  viewChildren,
} from '@angular/core';
import { BrnToggleDirective } from '@spartan-ng/ui-toggle-brain';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';
import { hlmMuted, hlmP } from '@spartan-ng/ui-typography-helm';
import { checkMultipleChoice } from '../../quiz.service';
import { ControlData } from '../control-data.token';
import { MultipleChoiceControl } from '../dynamic-forms.type';
import {
  BaseDynamicControl,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from './base-dynamic-control';
import { QuizTooltipComponent } from './components/quiz-tooltip.component';

@Component({
  selector: 'app-multiple-choice',
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
        @for (option of control.config.options; track $index) {
          <div class="relative">
            <button
              #toggles
              brnToggle
              hlm
              type="button"
              (toggled)="handleToggle(option.value, $index, $event)"
              [disabled]="controlSubmitted"
              class="w-full"
            >
              <span>{{ option.label }}</span>
            </button>
            @if (controlSubmitted) {
              @if (isSelectedAndCorrect(option.value)) {
                <app-quiz-tooltip type="exactMatch" />
              } @else if (isSelectedAndIncorrect(option.value)) {
                <app-quiz-tooltip type="partialMatch" />
              } @else if (isNotSelectedButCorrect(option.value)) {
                <app-quiz-tooltip type="correctButUnanswered" />
              }
            }
          </div>
        }
      </div>
    </app-quiz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultipleChoiceComponent extends BaseDynamicControl {
  protected override control = this
    .control as ControlData<MultipleChoiceControl>;

  private toggles = viewChildren('toggles', {
    read: BrnToggleDirective,
  });

  protected handleToggle(value: number, index: number, status: 'on' | 'off') {
    this.formControl.markAsDirty();
    if (this.control.config.mode === 'single') {
      this.formControl.setValue([value]);
      this.toggles().forEach((toggle, i) => {
        toggle.setState = i === index ? 'on' : 'off';
      });
    } else if (this.control.config.mode === 'multiple') {
      if (status === 'on') {
        this.formControl.setValue([...this.formControl.value, value]);
      } else {
        this.formControl.setValue(
          this.formControl.value.filter((v: number) => v !== value),
        );
      }
    }
  }

  protected correct = checkMultipleChoice(
    this.control.config.correctAnswer,
    this.control.config.answer,
  );

  protected isSelectedAndCorrect(value: number): boolean {
    return (
      this.control.config.answer.includes(value) &&
      this.control.config.correctAnswer.includes(value)
    );
  }
  protected isSelectedAndIncorrect(value: number): boolean {
    return (
      this.control.config.answer.includes(value) &&
      !this.control.config.correctAnswer.includes(value)
    );
  }

  protected isNotSelectedButCorrect(value: number): boolean {
    return (
      !this.control.config.answer.includes(value) &&
      this.control.config.correctAnswer.includes(value)
    );
  }
}
