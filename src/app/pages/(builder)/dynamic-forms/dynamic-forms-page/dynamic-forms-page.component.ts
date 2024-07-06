import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  signal,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { combineLatest, filter, map, merge } from 'rxjs';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { TabsComponent } from '../../../../shared/layout/tabs/tabs.component';
import { DynamicControl } from '../dynamic-forms.type';
import {
  addProperty,
  deleteProperty,
  editProperty,
} from '../utils/field-manipulation';
import { formConfigSchema } from '../utils/form-config.schema';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { EditFormDescriptionComponent } from './edit-form-description/edit-form-description.component';
import { ExportJsonComponent } from './export-json/export-json.component';
import { FieldGeneratorComponent } from './field-generator/field-generator.component';
import { ImportJsonComponent } from './import-json/import-json.component';

export const addControl = signal<string | null>(null);
export const editControl = signal<{
  object: DynamicControl;
  key: string;
  controlName: string;
} | null>(null);
export const deleteControl = signal<string | null>(null);
export const editDescription = signal<string | null>(null);

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [
    JsonPipe,
    TabsComponent,
    CodeComponent,
    CodePreviewDirective,
    FieldGeneratorComponent,
    EditFormDescriptionComponent,
    DynamicFormComponent,
    ImportJsonComponent,
    ExportJsonComponent,
    HlmSeparatorDirective,
    BrnSeparatorComponent,
  ],
  template: `
    @if (formConfig()) {
      <app-tabs firstTab="Preview" secondTab="JSON">
        <div firstTab appCodePreview>
          <app-dynamic-form
            [formConfig]="formConfig() || null"
            (formValue)="onSubmit($event)"
          />
        </div>
        <app-code secondTab [code]="formConfig()?.config | json" disableCopy />
      </app-tabs>
    }
    <div class="my-4 flex flex-col items-center justify-center">
      @switch (actions()) {
        @case ('addControl') {
          <app-field-generator
            (createFieldConfig)="addProperty($event)"
            (cancel)="addControl.set(null)"
          />
        }
        @case ('editControl') {
          <app-field-generator
            [formValue]="editControl()?.object"
            [controlName]="editControl()?.controlName"
            (createFieldConfig)="editProperty($event)"
            (cancel)="editControl.set(null)"
          />
        }
        @case ('editDescription') {
          <app-edit-form-description
            [description]="formConfig()?.config?.description || ''"
            (updateDescription)="formDescription.set($event)"
            (cancel)="editDescription.set(null)"
          />
        }
      }
    </div>
    <brn-separator hlmSeparator class="mb-4" />
    <div class="flex justify-center gap-4">
      <app-import-json
        (formDescription)="formDescription.set($event)"
        (controlConfig)="controlConfig.set($event)"
      />
      <app-export-json [formConfig]="formConfig()?.config || null" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormsPageComponent implements OnDestroy {
  protected controlConfig = signal<{ [key: string]: DynamicControl }>({});

  protected formDescription = signal<string>('New Form');

  protected formConfig = toSignal(
    combineLatest([
      toObservable(this.controlConfig).pipe(
        map((controls) => ({ controls, form: new FormGroup({}) })),
      ),
      toObservable(this.formDescription),
    ]).pipe(
      map(([{ controls, form }, description]) => {
        const config = { description, controls };
        const validationResult = formConfigSchema.safeParse(config);

        if (!validationResult.success) {
          throw new Error(`Something is wrong with your form config...`);
        }

        return { config: validationResult.data, form };
      }),
    ),
  );

  protected addControl = addControl;
  protected editControl = editControl;
  private deleteControl = deleteControl;
  protected editDescription = editDescription;

  protected actions = toSignal(
    merge(
      toObservable(this.addControl).pipe(
        map((value) => (value === null ? null : 'addControl')),
      ),
      toObservable(this.editControl).pipe(
        map((value) => (value === null ? null : 'editControl')),
      ),
      toObservable(this.editDescription).pipe(
        map((value) => (value === null ? null : 'editDescription')),
      ),
    ),
  );

  constructor() {
    toObservable(this.deleteControl)
      .pipe(filter(Boolean), takeUntilDestroyed())
      .subscribe((value) => {
        this.controlConfig.set(
          deleteProperty(this.formConfig()!.config, value).controls,
        );
      });
  }

  protected onSubmit(value: unknown): void {
    console.log('Submitted data: ', value);
  }

  protected addProperty(value: { [key: string]: DynamicControl }): void {
    this.controlConfig.set(
      addProperty(this.formConfig()!.config, value, this.addControl()!)
        .controls,
    );
    this.addControl.set(null);
  }

  protected editProperty(value: { [key: string]: DynamicControl }): void {
    this.controlConfig.set(
      editProperty(this.formConfig()!.config, value, this.editControl()!.key)
        .controls,
    );
    this.editControl.set(null);
  }

  ngOnDestroy(): void {
    this.addControl.set(null);
    this.editControl.set(null);
    this.deleteControl.set(null);
    this.editDescription.set(null);
  }
}
