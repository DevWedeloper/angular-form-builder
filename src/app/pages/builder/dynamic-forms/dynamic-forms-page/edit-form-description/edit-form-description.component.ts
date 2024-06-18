import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { merge } from 'rxjs';
import { DynamicValidatorMessageDirective } from '../../../../../shared/dynamic-form-errors/dynamic-validator-message.directive';

@Component({
  selector: 'app-edit-form-description',
  standalone: true,
  imports: [
    FormsModule,
    DynamicValidatorMessageDirective,
    HlmButtonDirective,
    HlmInputDirective,
  ],
  template: `
    <form class="flex gap-2">
      <input
        hlmInput
        type="text"
        id="description"
        [ngModel]="description()"
        (ngModelChange)="descriptionChange.set($event)"
        [ngModelOptions]="{ standalone: true }"
        required
      />
      <button hlmBtn type="button" (click)="cancel.emit()">Cancel</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFormDescriptionComponent {
  descriptionInput = input.required<string>({
    alias: 'description',
  });
  updateDescription = output<string>();
  cancel = output<void>();

  protected descriptionChange = signal<string>('');

  protected description = toSignal(
    merge(
      toObservable(this.descriptionChange),
      toObservable(this.descriptionInput),
    ),
  );

  constructor() {
    effect(() => {
      this.updateDescription.emit(this.description() || '');
    });
  }
}
