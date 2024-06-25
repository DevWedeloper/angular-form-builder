import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';
import { merge } from 'rxjs';
import { DynamicValidatorMessageDirective } from '../../../../../../shared/dynamic-form-errors/dynamic-validator-message.directive';
import { DynamicCheckboxControl } from '../../../dynamic-forms.type';

@Component({
  selector: 'app-checkbox-field-generator',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DynamicValidatorMessageDirective,
    HlmButtonDirective,
    HlmInputDirective,
    HlmLabelDirective,
    HlmSwitchComponent,
  ],
  template: `
    <form>
      <label hlmLabel for="controlName">Control Name</label>
      <input
        hlmInput
        type="text"
        id="controlName"
        [ngModel]="controlName()"
        (ngModelChange)="controlNameChange.set($event)"
        [ngModelOptions]="{ standalone: true }"
        required
        class="mb-4 w-full"
      />
    </form>
    <form [formGroup]="form()" (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <label hlmLabel for="label">Label</label>
        <input
          hlmInput
          formControlName="label"
          type="text"
          id="label"
          class="w-full"
        />
      </div>
      <div>
        <label hlmLabel for="value">Value</label>
        <label hlmLabel class="flex items-center" for="value">
          <hlm-switch class="mr-2" formControlName="value" id="value" />
          {{ form().value.value ? 'True' : 'False' }}
        </label>
      </div>
      <div>
        <label hlmLabel for="order">Order</label>
        <input
          hlmInput
          formControlName="order"
          type="number"
          id="order"
          min="0"
          class="w-full"
        />
      </div>
      <fieldset
        formGroupName="validators"
        class="rounded-md border border-border p-4"
      >
        <legend class="font-bold">Validators</legend>
        <div class="mb-4">
          <label hlmLabel class="flex items-center">
            <hlm-switch class="mr-2" formControlName="requiredTrue" />
            requiredTrue
          </label>
        </div>
      </fieldset>
      <button
        hlmBtn
        [disabled]="form().invalid || controlName() === ''"
        class="w-full"
      >
        Submit
      </button>
    </form>
  `,
})
export class CheckboxFieldGeneratorComponent {
  private fb = inject(FormBuilder);

  formValue = input<DynamicCheckboxControl>();
  controlNameInput = input<string | undefined>(undefined, {
    alias: 'controlName',
  });

  createFieldConfig = output<{
    [key: string]: DynamicCheckboxControl;
  }>();

  protected controlNameChange = signal<string>('');

  protected controlName = toSignal(
    merge(
      toObservable(this.controlNameChange),
      toObservable(this.controlNameInput),
    ),
  );

  protected form = computed(() => {
    return this.fb.nonNullable.group({
      controlType: ['checkbox' as const],
      label: [this.formValue()?.label || '', Validators.required],
      order: [this.formValue()?.order || 0, Validators.required],
      value: [this.formValue()?.value || false, Validators.required],
      validators: this.fb.nonNullable.group({
        requiredTrue: [this.formValue()?.validators?.requiredTrue || false],
      }),
    });
  });

  protected onSubmit() {
    const formValue = this.form().getRawValue();
    const validValidators = Object.fromEntries(
      Object.entries(formValue.validators).filter(([, value]) => value),
    );

    const { validators, ...rest } = formValue;
    const fieldConfig = Object.keys(validValidators).length
      ? { ...rest, validators: validValidators }
      : rest;

    this.createFieldConfig.emit({
      [this.controlName()!]: fieldConfig,
    });

    this.form().reset();
    this.controlNameChange.set('');
  }
}
