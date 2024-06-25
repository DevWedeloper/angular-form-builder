import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  host: {
    class: 'block rounded-sm border border-border',
  },
  template: `
    <div class="flex items-center justify-between bg-border px-4 py-2">
      <span>Question {{ index() + 1 }}</span>
      <span>
        {{
          showReceivedPoints()
            ? receivedPoints() + ' / ' + totalPoints() + ' pts'
            : totalPoints() + ' pts'
        }}
      </span>
    </div>
    <div class="p-4">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizCardComponent {
  index = input.required<number>();
  totalPoints = input.required<number>();
  showReceivedPoints = input(false);
  receivedPoints = input<number | null>(null);
}
