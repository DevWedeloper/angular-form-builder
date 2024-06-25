import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { twMerge } from 'tailwind-merge';

type AnswerStatus = 'exactMatch' | 'partialMatch' | 'correctButUnanswered';

@Component({
  selector: 'app-quiz-tooltip',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    @switch (type()) {
      @case ('exactMatch') {
        Correct!
      }
      @case ('partialMatch') {
        You Answered
      }
      @case ('correctButUnanswered') {
        Correct Answer
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizTooltipComponent {
  userClass = input<string>('', { alias: 'class' });
  type = input.required<AnswerStatus>();

  protected computedClass = computed(() => {
    const backgroundClass = this.getBackgroundClass(this.type());
    return twMerge(
      'absolute right-[calc(100%+4px)] top-1/2 w-max -translate-y-1/2 rounded-sm px-2 py-1',
      backgroundClass,
      this.userClass(),
    );
  });

  private getBackgroundClass(type: AnswerStatus): string {
    switch (type) {
      case 'exactMatch':
        return 'bg-green-500';
      case 'partialMatch':
        return 'bg-red-500';
      case 'correctButUnanswered':
        return 'bg-border';
    }
  }
}
