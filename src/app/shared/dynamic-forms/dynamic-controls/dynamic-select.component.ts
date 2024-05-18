import { Component } from '@angular/core';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { DynamicSelectControl } from '../dynamic-forms.type';
import {
  BaseDynamicControl,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [
    ...sharedDynamicControlDeps,
    BrnSelectImports,
    HlmSelectImports,
    HlmLabelDirective,
  ],
  viewProviders: [dynamicControlProvider],
  host: { class: 'mb-4 block' },
  template: `
    <label hlmLabel [for]="control.controlKey">
      {{ control.config.label }}
    </label>
    <brn-select
      [formControlName]="control.controlKey"
      [id]="control.controlKey"
    >
      <hlm-select-trigger class="w-full">
        <hlm-select-value />
      </hlm-select-trigger>
      <hlm-select-content>
        @for (option of options; track $index) {
          <hlm-option [value]="option.value">
            {{ option.label }}
          </hlm-option>
        }
      </hlm-select-content>
    </brn-select>
  `,
})
export class DynamicSelectComponent extends BaseDynamicControl {
  options = (this.control.config as DynamicSelectControl).options;
}
