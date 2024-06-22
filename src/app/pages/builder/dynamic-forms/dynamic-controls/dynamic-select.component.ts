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
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuImports } from '@spartan-ng/ui-menu-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { CONTROL_DATA, ControlData } from '../control-data.token';
import { CONTROL_PATH } from '../control-path.token';
import {
  deleteControl,
  editControl,
} from '../dynamic-forms-page/dynamic-forms-page.component';
import { DynamicSelectControl } from '../dynamic-forms.type';
import { resolveValidators } from '../resolve-validators';
import {
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [
    ...sharedDynamicControlDeps,
    HlmButtonModule,
    BrnSelectImports,
    HlmSelectImports,
    HlmLabelDirective,
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
        @for (option of control.config.options; track $index) {
          <hlm-option [value]="option.value">
            {{ option.label }}
          </hlm-option>
        }
      </hlm-select-content>
    </brn-select>
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
export class DynamicSelectComponent {
  protected controlPath = inject(CONTROL_PATH);

  protected control = inject(CONTROL_DATA) as ControlData<DynamicSelectControl>;

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
