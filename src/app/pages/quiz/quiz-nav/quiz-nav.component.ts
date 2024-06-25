import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormControlStatus } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmScrollAreaComponent } from '@spartan-ng/ui-scrollarea-helm';
import { QuizService } from '../quiz.service';

export const controls = signal<
  { index: number; status: FormControlStatus; dirty: boolean }[]
>([]);

@Component({
  selector: 'app-quiz-nav',
  standalone: true,
  imports: [NgClass, HlmButtonDirective, HlmScrollAreaComponent],
  host: {
    class: 'flex flex-col-reverse gap-2 lg:flex-col',
  },
  template: `
    <hlm-scroll-area class="flex h-[30vh] w-40 flex-col">
      @for (control of sortedControls(); track $index) {
        <button
          hlmBtn
          variant="link"
          [ngClass]="{
            'text-green-500': control.status === 'VALID',
            'text-red-500': control.status === 'INVALID'
          }"
          [disabled]="!control.dirty"
          class="text-none my-1 h-6 w-fit text-base hover:no-underline disabled:text-gray-500"
          (click)="currentPage.set(equivalentPage(control.index))"
        >
          Question {{ control.index + 1 }}
        </button>
      }
    </hlm-scroll-area>
    <div class="flex flex-col px-4">
      <span>Time Elapsed:</span>
      <span>{{ displayTimer() }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizNavComponent {
  private controls = controls;

  protected sortedControls = computed(() => {
    return [...this.controls()].sort((a, b) => a.index - b.index);
  });

  private perPage = inject(QuizService).perPage;

  protected currentPage = inject(QuizService).currentPage;

  protected displayTimer = inject(QuizService).displayTimer;

  protected equivalentPage(index: number): number {
    return Math.floor(index / this.perPage()) + 1;
  }
}
