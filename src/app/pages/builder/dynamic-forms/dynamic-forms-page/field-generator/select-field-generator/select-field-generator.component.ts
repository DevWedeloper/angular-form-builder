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
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideTrash2 } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';
import { merge } from 'rxjs';
import { DynamicValidatorMessageDirective } from '../../../../../../shared/dynamic-form-errors/dynamic-validator-message.directive';
import { DynamicSelectControl } from '../../../dynamic-forms.type';

@Component({
  selector: 'app-select-field-generator',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DynamicValidatorMessageDirective,
    HlmButtonDirective,
    HlmIconComponent,
    HlmInputDirective,
    HlmLabelDirective,
    HlmSwitchComponent,
  ],
  providers: [provideIcons({ lucideTrash2 })],
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
          class="w-full"
        />
      </div>
      <fieldset
        formArrayName="options"
        class="rounded-md border border-border p-4"
      >
        <legend class="font-bold">Options</legend>
        <div class="mb-4 space-y-4">
          @for (option of form().value.options; track $index) {
            <div [formGroupName]="$index" class="relative">
              <button
                hlmBtn
                variant="ghost"
                type="button"
                class="absolute right-0 h-6 w-6 p-1"
                (click)="removeOption($index)"
              >
                <hlm-icon name="lucideTrash2" class="text-red-500" />
              </button>
              <label hlmLabel for="option-{{ $index }}">
                Option {{ $index + 1 }}
              </label>
              <div class="space-y-2">
                <input
                  hlmInput
                  formControlName="label"
                  type="text"
                  placeholder="Label"
                  id="option-label-{{ $index }}"
                  class="w-full"
                />
                <input
                  hlmInput
                  formControlName="value"
                  type="text"
                  placeholder="Value"
                  id="option-value-{{ $index }}"
                  class="w-full"
                />
              </div>
            </div>
          }
        </div>
        <button hlmBtn type="button" (click)="addOption()" class="w-full">
          Add Option
        </button>
      </fieldset>
      <fieldset
        formGroupName="validators"
        class="rounded-md border border-border p-4"
      >
        <legend class="font-bold">Validators</legend>
        <div class="mb-4">
          <label hlmLabel class="flex items-center">
            <hlm-switch class="mr-2" formControlName="required" />
            required
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
export class SelectFieldGeneratorComponent {
  private fb = inject(FormBuilder);

  formValue = input<DynamicSelectControl>();
  controlNameInput = input<string | undefined>(undefined, {
    alias: 'controlName',
  });

  createFieldConfig = output<{
    [key: string]: DynamicSelectControl;
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
      controlType: ['select' as const],
      label: [this.formValue()?.label || '', Validators.required],
      order: [
        this.formValue()?.order || 0,
        [Validators.required, Validators.min(0)],
      ],
      value: [this.formValue()?.value || ''],
      options: this.fb.nonNullable.array(
        (this.formValue()?.options!.map((option) => {
          return new FormGroup({
            label: new FormControl(option.label, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            value: new FormControl(option.value, {
              nonNullable: true,
              validators: [Validators.required],
            }),
          });
        }) || []) as FormGroup<{
          label: FormControl<string>;
          value: FormControl<string>;
        }>[],
      ),
      validators: this.fb.nonNullable.group({
        required: [this.formValue()?.validators?.required || false],
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
    this.form().controls.options.clear();
  }

  protected addOption() {
    this.form().controls.options.push(
      new FormGroup({
        label: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        value: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    );
  }

  protected removeOption(index: number) {
    this.form().controls.options.removeAt(index);
  }
}
