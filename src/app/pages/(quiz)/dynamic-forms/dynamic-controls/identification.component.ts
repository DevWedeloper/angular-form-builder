import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { hlmMuted } from '@spartan-ng/ui-typography-helm';
import { checkIdentification } from '../../quiz.service';
import { ControlData } from '../control-data.token';
import { IdentificationControl } from '../dynamic-forms.type';
import {
  BaseDynamicControl,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from './base-dynamic-control';
import { QuizTooltipComponent } from './components/quiz-tooltip.component';

@Component({
  selector: 'app-identification',
  standalone: true,
  imports: [
    ...sharedDynamicControlDeps,
    QuizTooltipComponent,
    HlmInputDirective,
    HlmLabelDirective,
    HlmSeparatorDirective,
    BrnSeparatorComponent,
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
      <label hlmLabel [for]="control.controlKey">
        {{ control.config.question }}
      </label>
      @if (control.config.note) {
        <p class="${hlmMuted}">{{ control.config.note }}</p>
      }
      <div class="relative">
        <input
          hlmInput
          [formControlName]="control.controlKey"
          [id]="control.controlKey"
          type="text"
          class="mt-2 w-full"
        />
        @if (controlSubmitted) {
          <app-quiz-tooltip [type]="correct ? 'exactMatch' : 'partialMatch'" />
        }
      </div>
      @if (controlSubmitted) {
        <brn-separator hlmSeparator class="my-4" />
        <div class="relative">
          @for (answer of control.config.correctAnswer; track $index) {
            <p class="${hlmMuted}">{{ answer }}</p>
          }
          <app-quiz-tooltip type="correctButUnanswered" />
        </div>
      }
    </app-quiz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdentificationComponent extends BaseDynamicControl {
  protected override control = this
    .control as ControlData<IdentificationControl>;

  protected correct = checkIdentification(
    this.control.config.correctAnswer,
    this.control.config.answer,
  );
}
