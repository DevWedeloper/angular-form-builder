import { InjectionToken } from '@angular/core';
import { DynamicControl } from './dynamic-forms.type';

export type ControlData<T extends DynamicControl = DynamicControl> = {
  controlKey: string;
  config: T;
};

export const CONTROL_DATA = new InjectionToken<ControlData>('Control Data');
