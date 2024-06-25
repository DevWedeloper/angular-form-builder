import { InjectionToken } from '@angular/core';
import { QuizControl } from './dynamic-forms.type';

export type ControlData<T extends QuizControl = QuizControl> = {
  controlKey: string;
  config: T;
};

export const CONTROL_DATA = new InjectionToken<ControlData>('Control Data');
