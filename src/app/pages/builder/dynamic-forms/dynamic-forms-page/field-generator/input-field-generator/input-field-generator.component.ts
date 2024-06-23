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
import { DynamicInputControl } from '../../../dynamic-forms.type';

@Component({
  selector: 'app-input-field-generator',
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
        <label hlmLabel for="type">Type</label>
        <input
          hlmInput
          formControlName="type"
          type="text"
          id="type"
          class="w-full"
        />
      </div>
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
        <input
          hlmInput
          formControlName="value"
          type="text"
          id="value"
          class="w-full"
        />
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
          <label hlmLabel for="required" class="flex items-center">
            <hlm-switch formControlName="required" id="required" class="mr-2" />
            Required
          </label>
        </div>
        <div class="mb-4">
          <label hlmLabel for="email" class="flex items-center">
            <hlm-switch formControlName="email" id="email" class="mr-2" />
            Email
          </label>
        </div>
        <div class="mb-4">
          <label hlmLabel for="minLength">Min Length</label>
          <input
            hlmInput
            formControlName="minLength"
            type="number"
            id="minLength"
            min="0"
            class="w-full"
          />
        </div>
        <div class="mb-4">
          <label hlmLabel for="pattern">Pattern</label>
          <input
            hlmInput
            formControlName="pattern"
            type="text"
            id="pattern"
            class="w-full"
          />
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
export class InputFieldGeneratorComponent {
  private fb = inject(FormBuilder);

  formValue = input<DynamicInputControl>();
  controlNameInput = input<string | undefined>(undefined, {
    alias: 'controlName',
  });

  createFieldConfig = output<{
    [key: string]: DynamicInputControl;
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
      controlType: ['input' as const],
      type: [this.formValue()?.type || '', Validators.required],
      label: [this.formValue()?.label || '', Validators.required],
      order: [this.formValue()?.order || 0, Validators.required],
      value: [this.formValue()?.value || ''],
      validators: this.fb.nonNullable.group({
        required: [this.formValue()?.validators?.required || false],
        email: [this.formValue()?.validators?.email || false],
        minLength: [this.formValue()?.validators?.minLength || 0],
        pattern: [this.formValue()?.validators?.pattern || ''],
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
