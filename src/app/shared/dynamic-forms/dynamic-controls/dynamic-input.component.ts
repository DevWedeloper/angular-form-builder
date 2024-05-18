import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { DynamicInputControl } from '../dynamic-forms.type';
import {
  BaseDynamicControl,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [...sharedDynamicControlDeps, HlmInputDirective, HlmLabelDirective],
  viewProviders: [dynamicControlProvider],
  host: { class: 'mb-4 block' },
  template: `
    <label hlmLabel [for]="control.controlKey">
      {{ control.config.label }}
    </label>
    <input
      hlmInput
      [formControlName]="control.controlKey"
      [value]="control.config.value"
      [id]="control.controlKey"
      [type]="type"
      class="w-full"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicInputComponent extends BaseDynamicControl {
  type = (this.control.config as DynamicInputControl).type;
}
