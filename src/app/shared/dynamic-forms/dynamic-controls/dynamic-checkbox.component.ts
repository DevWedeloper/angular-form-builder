import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { ValidatorMessageContainerDirective } from '../../dynamic-form-errors/input-error/validator-message-container.directive';
import {
  BaseDynamicControl,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-checkbox',
  standalone: true,
  imports: [
    ...sharedDynamicControlDeps,
    ValidatorMessageContainerDirective,
    HlmCheckboxComponent,
  ],
  viewProviders: [dynamicControlProvider],
  host: { class: 'mb-4 block' },
  template: `
    <label hlmLabel [for]="control.controlKey">
      <hlm-checkbox
        class="mr-2"
        [container]="containerDir.container"
        [formControlName]="control.controlKey"
        [checked]="control.config.value"
        [id]="control.controlKey"
      />
      {{ control.config.label }}
    </label>
    <ng-container
      ValidatorMessageContainerDirective
      #containerDir="ValidatorMessageContainerDirective"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicCheckboxComponent extends BaseDynamicControl {}
