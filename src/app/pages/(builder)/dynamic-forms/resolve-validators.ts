import { Validators } from '@angular/forms';
import { DynamicControlWithoutGroup } from './dynamic-forms.type';

export function resolveValidators({
  validators = {},
}: DynamicControlWithoutGroup) {
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
      if (validatorKey === 'minLength' && typeof validatorValue === 'number') {
        return Validators.minLength(validatorValue);
      }
      return Validators.nullValidator;
    },
  );
}
