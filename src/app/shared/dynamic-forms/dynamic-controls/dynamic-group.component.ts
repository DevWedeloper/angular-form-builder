import { AsyncPipe, KeyValuePipe, NgComponentOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlInjectorPipe } from '../control-injector.pipe';
import { DynamicControlResolverService } from '../dynamic-control-resolver.service';
import { DynamicGroupControl } from '../dynamic-forms.type';
import {
  BaseDynamicControl,
  comparatorFn,
  dynamicControlProvider,
} from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-group',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgComponentOutlet,
    AsyncPipe,
    KeyValuePipe,
    ControlInjectorPipe,
  ],
  viewProviders: [dynamicControlProvider],
  host: { class: 'mb-4 block' },
  template: `
    <fieldset
      [formGroupName]="control.controlKey"
      class="rounded-md border border-border p-4"
    >
      <legend class="font-bold">{{ control.config.label }}</legend>
      @for (control of controls | keyvalue: comparatorFn; track $index) {
        <ng-container
          [ngComponentOutlet]="
            controlResolver.resolve(control.value.controlType) | async
          "
          [ngComponentOutletInjector]="
            control.key | controlInjector: control.value
          "
        />
      }
    </fieldset>
  `,
})
export class DynamicGroupComponent extends BaseDynamicControl {
  protected controlResolver = inject(DynamicControlResolverService);
  override formControl = new FormGroup({});
  protected comparatorFn = comparatorFn;
  controls = (this.control.config as unknown as DynamicGroupControl).controls;
}
