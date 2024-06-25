import { Component, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideUpload } from '@ng-icons/lucide';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmIconModule } from '@spartan-ng/ui-icon-helm';
import { DynamicControl, DynamicFormConfig } from '../../dynamic-forms.type';

@Component({
  selector: 'app-import-json',
  standalone: true,
  imports: [HlmButtonModule, HlmIconModule],
  providers: [provideIcons({ lucideUpload })],
  template: `
    <input
      id="import-json"
      type="file"
      accept=".json"
      hidden
      (change)="useJSONforForm($event)"
    />
    <label hlmBtn for="import-json">
      <hlm-icon size="sm" class="mr-2" name="lucideUpload" />
      Import JSON
    </label>
  `,
})
export class ImportJsonComponent {
  formDescription = output<string>();
  controlConfig = output<{ [key: string]: DynamicControl }>();

  protected useJSONforForm(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const jsonData: DynamicFormConfig = JSON.parse(result);
          this.formDescription.emit(jsonData.description);
          this.controlConfig.emit(jsonData.controls);
        }
      };
      reader.readAsText(file);
    }
  }
}
