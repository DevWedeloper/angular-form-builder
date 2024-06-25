import { AsyncPipe, KeyValuePipe, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { QuizNavComponent } from '../../quiz-nav/quiz-nav.component';
import { QuizService } from '../../quiz.service';
import { ControlInjectorPipe } from '../control-injector.pipe';
import { DynamicControlResolverService } from '../dynamic-control-resolver.service';
import { comparatorFn } from '../dynamic-controls/base-dynamic-control';

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgComponentOutlet,
    AsyncPipe,
    KeyValuePipe,
    ControlInjectorPipe,
    HlmButtonDirective,
    QuizNavComponent,
  ],
  host: {
    class: 'flex w-full justify-center gap-4 flex-col lg:flex-row',
  },
  template: `
    @if (formConfig()) {
      <div class="flex w-full justify-center">
        <form
          class="w-[450px] rounded-md border border-border p-4"
          [formGroup]="formConfig()!.form"
          (ngSubmit)="onSubmit(formConfig()!.form)"
        >
          @for (
            control of formConfig()?.controls | keyvalue: comparatorFn;
            track {}
          ) {
            <ng-container
              [ngComponentOutlet]="
                controlResolver.resolve(control.value.controlType) | async
              "
              [ngComponentOutletInjector]="
                control.key | controlInjector: control.value : $index
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
            @if (currentPage() === totalPages()) {
              <button hlmBtn [disabled]="(formConfig()?.form)!.invalid">
                Submit
              </button>
            }
          </div>
        </form>
      </div>
      <div class="flex w-full justify-center">
        <app-quiz-nav />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormsPageComponent {
  protected controlResolver = inject(DynamicControlResolverService);

  protected comparatorFn = comparatorFn;

  protected formConfig = inject(QuizService).formConfig;

  protected currentPage = inject(QuizService).currentPage;
  protected totalPages = inject(QuizService).totalPages;
  private answers = inject(QuizService).answers;
  private showQuizResults = inject(QuizService).showQuizResults;

  protected onSubmit(form: FormGroup) {
    this.answers.set(form.getRawValue());
    this.showQuizResults.set(true);
    this.currentPage.set(1);
  }
}
