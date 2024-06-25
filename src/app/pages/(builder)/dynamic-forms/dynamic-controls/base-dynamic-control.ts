import { KeyValue } from '@angular/common';
import { StaticProvider, inject } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { DynamicValidatorMessageDirective } from '../../../../shared/dynamic-form-errors/dynamic-validator-message.directive';
import { DynamicControl } from '../dynamic-forms.type';

export const comparatorFn = (
  a: KeyValue<string, DynamicControl>,
  b: KeyValue<string, DynamicControl>,
): number => a.value.order - b.value.order;

export const sharedDynamicControlDeps = [
  ReactiveFormsModule,
  DynamicValidatorMessageDirective,
];

export const dynamicControlProvider: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => inject(ControlContainer, { skipSelf: true }),
};
