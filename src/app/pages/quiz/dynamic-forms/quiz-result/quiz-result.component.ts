import { AsyncPipe, KeyValuePipe, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlmP } from '@spartan-ng/ui-typography-helm';
import { QuizService } from '../../quiz.service';
import { ControlInjectorPipe } from '../control-injector.pipe';
import { DynamicControlResolverService } from '../dynamic-control-resolver.service';
import { comparatorFn } from '../dynamic-controls/base-dynamic-control';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgComponentOutlet,
    AsyncPipe,
    KeyValuePipe,
    ControlInjectorPipe,
    HlmButtonDirective,
  ],
  host: {
    class: 'flex w-full flex-col items-center justify-center',
  },
  template: `
    <div class="mb-4">
      <p class="${hlmP}">
        Score for this quiz: {{ totalScore() }}/{{ totalPossibleScore() }} (some
        questions have not been checked yet).
      </p>
      <p>This attempt took: {{ displayTimer() }}</p>
    </div>
    @if (controlWithAnswers()) {
      <div class="flex w-full justify-center">
        <form
          class="w-[450px] rounded-md border border-border p-4"
          [formGroup]="form"
        >
          @for (
            control of controlWithAnswers() | keyvalue: comparatorFn;
            track {}
          ) {
            <ng-container
              [ngComponentOutlet]="
                controlResolver.resolve(control.value.controlType) | async
              "
              [ngComponentOutletInjector]="
                control.key | controlInjector: control.value : $index : true
              "
            />
          }
          <div class="flex gap-4">
            <div class="flex w-full justify-between">
              <button
                size="sm"
                variant="outline"
                hlmBtn
                type="button"
                [disabled]="currentPage() === 1"
                (click)="currentPage.set(currentPage() - 1)"
              >
                Previous
              </button>
              <button
                size="sm"
                variant="outline"
                hlmBtn
                type="button"
                [disabled]="currentPage() === totalPages()"
                (click)="currentPage.set(currentPage() + 1)"
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizResultComponent {
  protected controlResolver = inject(DynamicControlResolverService);

  protected comparatorFn = comparatorFn;

  protected controlWithAnswers = inject(QuizService).controlWithAnswers;
  protected totalScore = inject(QuizService).totalScore;
  protected totalPossibleScore = inject(QuizService).totalPossibleScore;
  protected displayTimer = inject(QuizService).displayTimer;
  protected currentPage = inject(QuizService).currentPage;
  protected totalPages = inject(QuizService).totalPages;

  protected form = new FormGroup({});
}
