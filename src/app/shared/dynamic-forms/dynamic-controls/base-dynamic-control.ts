import { KeyValue } from '@angular/common';
import { Directive, OnInit, StaticProvider, inject } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicValidatorMessageDirective } from '../../dynamic-form-errors/dynamic-validator-message.directive';
import { CONTROL_DATA } from '../control-data.token';
import {
  DynamicControl,
  DynamicControlWithoutGroup,
} from '../dynamic-forms.type';

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

@Directive()
export class BaseDynamicControl implements OnInit {
  control = inject(CONTROL_DATA);

  formControl: AbstractControl = new FormControl(
    this.control.config.value,
    this.resolveValidators(this.control.config),
  );

  private parentGroupDir = inject(ControlContainer);

  ngOnInit() {
    (this.parentGroupDir.control as FormGroup).addControl(
      this.control.controlKey,
      this.formControl,
    );
  }

  private resolveValidators({ validators = {} }: DynamicControlWithoutGroup) {
    return (Object.keys(validators) as Array<keyof typeof validators>).map(
      (validatorKey) => {
        const validatorValue = validators[validatorKey];
        if (validatorKey === 'required') {
          return Validators.required;
        }
        if (validatorKey === 'email') {
          return Validators.email;
        }
        if (validatorKey === 'requiredTrue') {
          return Validators.requiredTrue;
        }
        if (
          validatorKey === 'minLength' &&
          typeof validatorValue === 'number'
        ) {
          return Validators.minLength(validatorValue);
        }
        return Validators.nullValidator;
      },
    );
  }
}
