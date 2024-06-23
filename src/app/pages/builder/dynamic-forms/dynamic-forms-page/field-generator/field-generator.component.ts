import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { concat, map } from 'rxjs';
import {
  ControlType,
  DynamicCheckboxControl,
  DynamicControl,
  DynamicGroupControl,
  DynamicInputControl,
  DynamicSelectControl,
} from '../../dynamic-forms.type';
import { CheckboxFieldGeneratorComponent } from './checkbox-field-generator/checkbox-field-generator.component';
import { GroupFieldGeneratorComponent } from './group-field-generator/group-field-generator.component';
import { InputFieldGeneratorComponent } from './input-field-generator/input-field-generator.component';
import { SelectFieldGeneratorComponent } from './select-field-generator/select-field-generator.component';

@Component({
  selector: 'app-field-generator',
  standalone: true,
  imports: [
    FormsModule,
    InputFieldGeneratorComponent,
    SelectFieldGeneratorComponent,
    CheckboxFieldGeneratorComponent,
    GroupFieldGeneratorComponent,
    HlmButtonDirective,
    BrnSelectImports,
    HlmSelectImports,
  ],
  template: `
    <form class="mb-4 flex gap-2">
      <brn-select
        class="inline-block"
        placeholder="Select the type of field"
        [ngModel]="fieldType()"
        (ngModelChange)="fieldTypeChange.set($event)"
        [ngModelOptions]="{ standalone: true }"
      >
        <hlm-select-trigger class="w-56">
          <hlm-select-value />
        </hlm-select-trigger>
        <hlm-select-content>
          <hlm-option value="input">Input</hlm-option>
          <hlm-option value="select">Select</hlm-option>
          <hlm-option value="checkbox">Checkbox</hlm-option>
          <hlm-option value="group">Group</hlm-option>
        </hlm-select-content>
      </brn-select>
      <button hlmBtn type="button" (click)="cancel.emit()">Cancel</button>
    </form>
    @switch (fieldTypeChange()) {
      @case ('input') {
        <app-input-field-generator
          [formValue]="inputFormValue()"
          [controlName]="controlName()"
          (createFieldConfig)="createFieldConfig.emit($event)"
        />
      }
      @case ('select') {
        <app-select-field-generator
          [formValue]="selectFormValue()"
          [controlName]="controlName()"
          (createFieldConfig)="createFieldConfig.emit($event)"
        />
      }
      @case ('checkbox') {
        <app-checkbox-field-generator
          [formValue]="checkboxFormValue()"
          [controlName]="controlName()"
          (createFieldConfig)="createFieldConfig.emit($event)"
        />
      }
      @case ('group') {
        <app-group-field-generator
          [formValue]="groupFormValue()"
          [controlName]="controlName()"
          (createFieldConfig)="createFieldConfig.emit($event)"
        />
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldGeneratorComponent {
  formValue = input<DynamicControl>();
  controlName = input<string>();
  createFieldConfig = output<{ [key: string]: DynamicControl }>();
  cancel = output<void>();

  protected fieldTypeChange = signal<ControlType | null>(null);

  protected fieldType = toSignal(
    concat(
      toObservable(this.formValue).pipe(
        map((value) => value?.controlType || null),
      ),
      toObservable(this.fieldTypeChange),
    ),
  );

  protected inputFormValue = computed(() => {
    if (this.formValue()?.controlType === 'input') {
      return this.formValue() as DynamicInputControl;
    }
    return undefined;
  });

  protected selectFormValue = computed(() => {
    if (this.formValue()?.controlType === 'select') {
      return this.formValue() as DynamicSelectControl;
    }
    return undefined;
  });

  protected checkboxFormValue = computed(() => {
    if (this.formValue()?.controlType === 'checkbox') {
      return this.formValue() as DynamicCheckboxControl;
    }
    return undefined;
  });

  protected groupFormValue = computed(() => {
    if (this.formValue()?.controlType === 'group') {
      return this.formValue() as DynamicGroupControl;
    }
    return undefined;
  });
}
