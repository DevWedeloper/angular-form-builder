export type ControlType =
  | 'identification'
  | 'trueOrFalse'
  | 'multipleChoice'
  | 'essay';

export type BaseControl<T = string, K = string[]> = {
  controlType: ControlType;
  question: string;
  note?: string;
  answer: T;
  correctAnswer: K;
  points: number;
  order: number;
};

export type IdentificationControl = BaseControl & {
  controlType: 'identification';
};

export type TrueOrFalseControl = BaseControl<boolean, boolean> & {
  controlType: 'trueOrFalse';
};

export type MultipleChoiceControl = BaseControl<number[], number[]> & {
  controlType: 'multipleChoice';
  mode: 'single' | 'multiple';
  options: { label: string; value: number }[];
};

export type EssayControl = Omit<BaseControl, 'correctAnswer'> & {
  controlType: 'essay';
};

export type QuizControl =
  | IdentificationControl
  | TrueOrFalseControl
  | MultipleChoiceControl
  | EssayControl;

export type QuizFormControls = {
  [key: string]: QuizControl;
};

export type Answers = {
  [key: string]: string | boolean | number[];
};
