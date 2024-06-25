import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { map, merge } from 'rxjs';
import { CodePreviewDirective } from '../../shared/code/code-preview.directive';
import { PageNavOutletComponent } from '../../shared/layout/page-nav/page-nav-outlet/page-nav-outlet.component';
import { PageNavComponent } from '../../shared/layout/page-nav/page-nav/page-nav.component';
import { MainSectionDirective } from '../../shared/main-section.directive';
import { SectionIntroComponent } from '../../shared/section-intro/section-intro.component';
import { SectionSubHeadingComponent } from '../../shared/section-sub-heading/section-sub-heading.component';
import { DynamicFormsPageComponent } from './dynamic-forms/dynamic-forms-page/dynamic-forms-page.component';
import { QuizResultComponent } from './dynamic-forms/quiz-result/quiz-result.component';
import { QuizService } from './quiz.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    PageNavComponent,
    PageNavOutletComponent,
    MainSectionDirective,
    SectionIntroComponent,
    CodePreviewDirective,
    HlmButtonDirective,
    SectionSubHeadingComponent,
    DynamicFormsPageComponent,
    QuizResultComponent,
  ],
  template: `
    <section appMainSection>
      <app-section-intro
        name="Quiz App"
        lead="An example quiz app made with dynamic forms."
      />

      <div appCodePreview class="rounded-md border border-border">
        @switch (quizFlow()) {
          @case ('initial') {
            <button hlmBtn (click)="startQuiz.set(true)">
              Start
            </button>
          }
          @case ('inProgress') {
            <app-dynamic-forms-page />
          }
          @case ('result') {
            <app-quiz-result />
          }
        }
      </div>
    </section>
    <app-page-nav />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class QuizComponent {
  private showQuizResults = inject(QuizService).showQuizResults;
  protected startQuiz = inject(QuizService).startQuiz;

  protected quizFlow = toSignal(
    merge(
      toObservable(this.startQuiz).pipe(
        map((value) => (value === true ? 'inProgress' : 'initial')),
      ),
      toObservable(this.showQuizResults).pipe(
        map((value) => (value === true ? 'result' : 'initial')),
      ),
    ),
    {
      initialValue: 'initial',
    },
  );
}
