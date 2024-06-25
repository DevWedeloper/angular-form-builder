import {
  AsyncPipe,
  JsonPipe,
  KeyValuePipe,
  NgComponentOutlet,
} from '@angular/common';
import { Component, inject, input, output, viewChild } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucidePencil, lucidePlus, lucideSettings } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconModule } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuImports } from '@spartan-ng/ui-menu-helm';
import { hlmH3, hlmP } from '@spartan-ng/ui-typography-helm';
import { ControlInjectorPipe } from '../../control-injector.pipe';
import { DynamicControlResolverService } from '../../dynamic-control-resolver.service';
import { comparatorFn } from '../../dynamic-controls/base-dynamic-control';
import { DynamicFormConfig } from '../../dynamic-forms.type';
import { addControl, editDescription } from '../dynamic-forms-page.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgComponentOutlet,
    AsyncPipe,
    KeyValuePipe,
    JsonPipe,
    ControlInjectorPipe,
    HlmButtonDirective,
    HlmIconModule,
    BrnMenuTriggerDirective,
    HlmMenuImports,
  ],
  providers: [provideIcons({ lucideSettings, lucidePlus, lucidePencil })],
  host: {
    class: 'flex w-full justify-center',
  },
  template: `
    @if ((formConfig()?.config?.controls | json) !== ({} | json)) {
      <form
        class="relative w-[450px] rounded-md border border-border p-4"
        [formGroup]="formConfig()!.form"
        (ngSubmit)="onSubmit(formConfig()!.form)"
      >
        <button
          hlmBtn
          [brnMenuTriggerFor]="actionsTpl"
          variant="ghost"
          type="button"
          class="absolute right-4 top-4 h-6 w-6 p-1"
        >
          <hlm-icon name="lucideSettings" />
        </button>
        <h3 class="${hlmH3} mb-4 inline-block">
          {{ formConfig()?.config?.description }}
        </h3>
        <button
          hlmBtn
          variant="ghost"
          type="button"
          class="ml-2 h-6 w-6 p-1"
          (click)="editDescription.set((formConfig()?.config)!.description)"
        >
          <hlm-icon name="lucidePencil" />
        </button>
        <!-- We cant use track because the form controls have to be reset every time
        the form is modified. -->
        @for (
          control of formConfig()?.config?.controls | keyvalue: comparatorFn;
          track {}
        ) {
          <ng-container
            [ngComponentOutlet]="
              controlResolver.resolve(control.value.controlType) | async
            "
            [ngComponentOutletInjector]="
              control.key | controlInjector: control.value : control.key
            "
          />
        }
        <button
          hlmBtn
          [disabled]="(formConfig()?.form)!.invalid"
          class="w-full"
        >
          Save
        </button>
      </form>
    } @else {
      <div class="flex flex-col items-center gap-2">
        <p class="${hlmP}">Current form is empty, try adding a field.</p>
        <button hlmBtn class="w-fit" (click)="addControl.set('')">
          Add field
        </button>
      </div>
    }
    <ng-template #actionsTpl>
      <hlm-menu class="w-40">
        <button hlmMenuItem (click)="addControl.set('')">
          <hlm-icon name="lucidePlus" hlmMenuIcon class="text-blue-500" />
          <span>Add</span>
        </button>
      </hlm-menu>
    </ng-template>
  `,
})
export class DynamicFormComponent {
  protected controlResolver = inject(DynamicControlResolverService);

  protected comparatorFn = comparatorFn;

  private formDir = viewChild.required(FormGroupDirective);

  formConfig = input.required<{
    config: DynamicFormConfig;
    form: FormGroup;
  } | null>();
  formValue = output<unknown>();

  protected addControl = addControl;
  protected editDescription = editDescription;

  protected onSubmit(form: FormGroup): void {
    this.formValue.emit(form.getRawValue());
    this.formDir().resetForm();
  }
}
