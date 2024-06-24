import { Validators } from '@angular/forms';

export type DynamicOptions = {
  label: string;
  value: string;
};

type ValidatorKeys = keyof Omit<
  typeof Validators,
  'prototype' | 'compose' | 'composeAsync'
>;

export type ControlType = 'input' | 'select' | 'checkbox' | 'group';

export type DynamicBaseControl<T = string> = {
  controlType: ControlType;
  label: string;
  order: number;
  value: T | null;
  validators?: {
    [key in ValidatorKeys]?: unknown;
  };
};

export type DynamicInputControl = DynamicBaseControl & {
  controlType: 'input';
  type: string;
};

export type DynamicSelectControl = DynamicBaseControl & {
  controlType: 'select';
  options: DynamicOptions[];
};

export type DynamicCheckboxControl = DynamicBaseControl<boolean> & {
  controlType: 'checkbox';
};

export type DynamicGroupControl = Omit<
  DynamicBaseControl,
  'value' | 'validators'
> & {
  controlType: 'group';
  controls: { [key: string]: DynamicControl };
};

export type DynamicControl =
  | DynamicInputControl
  | DynamicSelectControl
  | DynamicCheckboxControl
  | DynamicGroupControl;

export type DynamicControlWithoutGroup = Exclude<
  DynamicControl,
  DynamicGroupControl
>;

export type DynamicFormConfig = {
  description: string;
  controls: {
    [key: string]: DynamicControl;
  };
};
