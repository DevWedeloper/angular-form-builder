import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import {
  EMPTY,
  catchError,
  filter,
  interval,
  map,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Answers, QuizFormControls } from './dynamic-forms/dynamic-forms.type';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private http = inject(HttpClient);
  formConfig = toSignal(
    this.http.get<QuizFormControls>(`quiz.form.json`).pipe(
      map((controls) => ({
        controls,
        form: new FormGroup({}),
      })),
    ),
  );

  currentPage = signal(1);
  perPage = signal(5);
  private totalItems = computed(() =>
    this.formConfig() ? Object.keys(this.formConfig()!.controls).length : 0,
  );
  totalPages = computed(() => Math.ceil(this.totalItems() / this.perPage()));
  currentIndexes = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.perPage();
    const endIndex = Math.min(startIndex + this.perPage(), this.totalItems());
    return Array.from(
      { length: endIndex - startIndex },
      (_, index) => startIndex + index,
    );
  });

  answers = signal<Answers | null>(null);
  controlWithAnswers = computed(() => {
    const currentAnswers = this.answers();
    const currentControls = this.formConfig()?.controls;

    if (!currentAnswers || !currentControls) {
      return null;
    }

    const newObject = Object.entries(currentControls).reduce(
      (acc, [key, control]) => {
        const answer = currentAnswers[key];
        acc[key] = {
          ...control,
          answer,
        };
        return acc;
      },
      {} as { [key: string]: any },
    );

    return newObject as QuizFormControls;
  });

  totalScore = computed(() => {
    const controlWithAnswers = this.controlWithAnswers();

    if (!controlWithAnswers) {
      return null;
    }

    const score = Object.keys(controlWithAnswers).reduce((totalScore, key) => {
      const control = controlWithAnswers[key];

      switch (control.controlType) {
        case 'identification':
          if (checkIdentification(control.correctAnswer, control.answer)) {
            return totalScore + control.points;
          }
          break;
        case 'trueOrFalse':
          if (checkTrueOrFalse(control.correctAnswer, control.answer)) {
            return totalScore + control.points;
          }
          break;
        case 'multipleChoice':
          if (checkMultipleChoice(control.correctAnswer, control.answer)) {
            return totalScore + control.points;
          }
          break;
      }

      return totalScore;
    }, 0);

    return score;
  });

  totalPossibleScore = computed(() => {
    const currentControls = this.formConfig()?.controls;

    if (!currentControls) {
      return null;
    }

    const totalPossibleScore = Object.keys(currentControls).reduce(
      (total, key) => {
        const control = currentControls[key];
        return total + control.points;
      },
      0,
    );

    return totalPossibleScore;
  });

  startQuiz = signal(false);
  showQuizResults = signal(false);

  private timer = toSignal(
    toObservable(this.startQuiz).pipe(
      filter(Boolean),
      switchMap(() => interval(1000)),
      takeUntil(toObservable(this.showQuizResults).pipe(filter(Boolean))),
    ),
    { initialValue: 0 },
  );

  displayTimer = computed(() => {
    const timer = this.timer();

    const seconds = timer % 60;
    const minutes = Math.floor(timer / 60) % 60;
    const hours = Math.floor(timer / (60 * 60)) % 24;
    const days = Math.floor(timer / (60 * 60 * 24));

    const formatTime = (value: number, unit: string): string =>
      value > 0 ? `${value} ${unit}${value > 1 ? 's' : ''}` : '';

    const formattedParts = [
      formatTime(days, 'day'),
      formatTime(hours, 'hour'),
      formatTime(minutes, 'minute'),
      formatTime(seconds, 'second'),
    ].filter((part) => part !== '');

    return formattedParts.join(', ') || '0 second';
  });
}

export const checkIdentification = (
  correctAnswer: string[],
  answer: string,
): boolean => {
  return correctAnswer.includes(answer);
};

export const checkTrueOrFalse = (
  correctAnswer: boolean,
  answer: boolean,
): boolean => {
  return correctAnswer === answer;
};

export const checkMultipleChoice = (
  correctAnswer: number[],
  answer: number[],
): boolean => {
  return correctAnswer.every((val) => answer.includes(val));
};
