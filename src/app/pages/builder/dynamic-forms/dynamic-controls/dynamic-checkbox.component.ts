import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideSettings, lucideTrash2 } from '@ng-icons/lucide';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuImports } from '@spartan-ng/ui-menu-helm';
import { ValidatorMessageContainerDirective } from '../../../../shared/dynamic-form-errors/input-error/validator-message-container.directive';
import { CONTROL_DATA, ControlData } from '../control-data.token';
import { CONTROL_PATH } from '../control-path.token';
import {
  deleteControl,
  editControl,
} from '../dynamic-forms-page/dynamic-forms-page.component';
import { DynamicCheckboxControl } from '../dynamic-forms.type';
import { resolveValidators } from '../resolve-validators';
import {
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-checkbox',
  standalone: true,
  imports: [
    ...sharedDynamicControlDeps,
    ValidatorMessageContainerDirective,
    HlmButtonModule,
    HlmCheckboxComponent,
    HlmIconComponent,
    BrnMenuTriggerDirective,
    HlmMenuImports,
  ],
  providers: [provideIcons({ lucidePencil, lucideSettings, lucideTrash2 })],
  viewProviders: [dynamicControlProvider],
  host: { class: 'relative mb-4 block' },
  template: `
    <button
      hlmBtn
      [brnMenuTriggerFor]="actionsTpl"
      variant="ghost"
      type="button"
      class="absolute right-0 h-6 w-6 p-1"
    >
      <hlm-icon name="lucideSettings" />
    </button>
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
      validatorMessageContainerDirective
      #containerDir="validatorMessageContainerDirective"
    />
    <ng-template #actionsTpl>
      <hlm-menu class="w-40">
        <button
          hlmMenuItem
          (click)="
            editControl.set({
              object: control.config,
              key: controlPath,
              controlName: control.controlKey
            })
          "
        >
          <hlm-icon name="lucidePencil" hlmMenuIcon class="text-green-500" />
          <span>Edit</span>
        </button>
        <button
          hlmMenuItem
          (click)="deleteControl.set(controlPath)"
        >
          <hlm-icon name="lucideTrash2" hlmMenuIcon class="text-red-500" />
          <span>Delete</span>
        </button>
      </hlm-menu>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicCheckboxComponent {
  protected controlPath = inject(CONTROL_PATH);

  protected control = inject(
    CONTROL_DATA,
  ) as ControlData<DynamicCheckboxControl>;

  private formControl: AbstractControl = new FormControl(
    this.control.config.value,
    resolveValidators(this.control.config),
  );

  private parentGroupDir = inject(ControlContainer);

  protected editControl = editControl;
  protected deleteControl = deleteControl;

  constructor() {
    (this.parentGroupDir.control as FormGroup).addControl(
      this.control.controlKey,
      this.formControl,
    );
  }
}
