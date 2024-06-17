import { JsonPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { lucideDownload } from '@ng-icons/lucide';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmIconModule, provideIcons } from '@spartan-ng/ui-icon-helm';
import { saveAs } from 'file-saver';
import { DynamicFormConfig } from '../../dynamic-forms.type';

@Component({
  selector: 'app-export-json',
  standalone: true,
  imports: [HlmButtonModule, HlmIconModule],
  providers: [provideIcons({ lucideDownload }), JsonPipe],
  template: `
    <button hlmBtn (click)="exportJSON()">
      <hlm-icon size="sm" class="mr-2" name="lucideDownload" />
      Export JSON
    </button>
  `,
})
export class ExportJsonComponent {
  private jsonPipe = inject(JsonPipe);

  formConfig = input.required<DynamicFormConfig | null>();

  protected exportJSON(): void {
    const jsonData = this.jsonPipe.transform(this.formConfig());
    const blob = new Blob([jsonData], { type: 'application/json' });
    const filename = 'example.json';
    saveAs(blob, filename);
  }
}
