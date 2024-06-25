import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { hlmMuted } from '@spartan-ng/ui-typography-helm';
import { ControlData } from '../control-data.token';
import { EssayControl } from '../dynamic-forms.type';
import {
  BaseDynamicControl,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from './base-dynamic-control';

@Component({
  selector: 'app-essay',
  standalone: true,
  imports: [...sharedDynamicControlDeps, HlmInputDirective, HlmLabelDirective],
  viewProviders: [dynamicControlProvider],
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    <app-quiz-card [index]="controlIndex" [totalPoints]="control.config.points">
      <label hlmLabel [for]="control.controlKey">
        {{ control.config.question }}
      </label>
      @if (control.config.note) {
        <p class="${hlmMuted}">{{ control.config.note }}</p>
      }
      <textarea
        hlmInput
        [formControlName]="control.controlKey"
        [id]="control.controlKey"
        class="mt-2 min-h-[100px] w-full"
      ></textarea>
    </app-quiz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EssayComponent extends BaseDynamicControl {
  protected override control = this.control as ControlData<EssayControl>;
}
