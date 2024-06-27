import { AsyncPipe, KeyValuePipe, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  lucidePencil,
  lucidePlus,
  lucideSettings,
  lucideTrash2,
} from '@ng-icons/lucide';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuImports } from '@spartan-ng/ui-menu-helm';
import { CONTROL_DATA, ControlData } from '../control-data.token';
import { ControlInjectorPipe } from '../control-injector.pipe';
import { CONTROL_PATH } from '../control-path.token';
import { DynamicControlResolverService } from '../dynamic-control-resolver.service';
import {
  addControl,
  deleteControl,
  editControl,
} from '../dynamic-forms-page/dynamic-forms-page.component';
import { DynamicGroupControl } from '../dynamic-forms.type';
import { comparatorFn, dynamicControlProvider } from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-group',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgComponentOutlet,
    AsyncPipe,
    KeyValuePipe,
    ControlInjectorPipe,
    HlmButtonModule,
    HlmIconComponent,
    BrnMenuTriggerDirective,
    HlmMenuImports,
  ],
  providers: [
    provideIcons({ lucideSettings, lucideTrash2, lucidePencil, lucidePlus }),
  ],
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
    <fieldset
      [formGroupName]="control.controlKey"
      class="rounded-md border border-border p-4"
    >
      <legend class="font-bold">{{ control.config.label }}</legend>
      @for (
        control of control.config.controls | keyvalue: comparatorFn;
        track control
      ) {
        <ng-container
          [ngComponentOutlet]="
            controlResolver.resolve(control.value.controlType) | async
          "
          [ngComponentOutletInjector]="
            control.key
              | controlInjector: control.value : controlPath + '.' + control.key
          "
        />
      }
    </fieldset>
    <ng-template #actionsTpl>
      <hlm-menu class="w-40">
        <button hlmMenuItem (click)="addControl.set(controlPath)">
          <hlm-icon name="lucidePlus" hlmMenuIcon class="text-blue-500" />
          <span>Add</span>
        </button>
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
        <button hlmMenuItem (click)="deleteControl.set(controlPath)">
          <hlm-icon name="lucideTrash2" hlmMenuIcon class="text-red-500" />
          <span>Delete</span>
        </button>
      </hlm-menu>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicGroupComponent {
  protected controlPath = inject(CONTROL_PATH);

  protected control = inject(CONTROL_DATA) as ControlData<DynamicGroupControl>;

  private formControl: AbstractControl = new FormGroup({});

  private parentGroupDir = inject(ControlContainer);

  protected controlResolver = inject(DynamicControlResolverService);
  protected comparatorFn = comparatorFn;

  protected addControl = addControl;
  protected editControl = editControl;
  protected deleteControl = deleteControl;

  constructor() {
    (this.parentGroupDir.control as FormGroup).addControl(
      this.control.controlKey,
      this.formControl,
    );
  }
}
