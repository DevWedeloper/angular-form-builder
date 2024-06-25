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
import { merge } from 'rxjs';
import { DynamicValidatorMessageDirective } from '../../../../../../shared/dynamic-form-errors/dynamic-validator-message.directive';
import { DynamicGroupControl } from '../../../dynamic-forms.type';

@Component({
  selector: 'app-group-field-generator',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DynamicValidatorMessageDirective,
    HlmButtonDirective,
    HlmInputDirective,
    HlmLabelDirective,
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
export class GroupFieldGeneratorComponent {
  private fb = inject(FormBuilder);

  formValue = input<DynamicGroupControl>();
  controlNameInput = input<string | undefined>(undefined, {
    alias: 'controlName',
  });

  createFieldConfig = output<{
    [key: string]: DynamicGroupControl;
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
      controlType: ['group' as const],
      label: [this.formValue()?.label || '', Validators.required],
      order: [this.formValue()?.order || 0, Validators.required],
      controls: this.fb.nonNullable.group(this.formValue()?.controls || {}),
    });
  });

  protected onSubmit() {
    this.createFieldConfig.emit({
      [this.controlName()!]: this.form().getRawValue(),
    });
    this.form().reset();
    this.controlNameChange.set('');
  }
}
