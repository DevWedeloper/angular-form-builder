export const baseJSONObject = `
{
  "description": "",
  "controls": {}
}
`;

export const baseInputObject = `
"controlName": {
  "controlType": "input",
  "type": "",
  "label": "",
  "value": "",
  "order": 0,
  "validators": {}
},`;

export const baseSelectObject = `
"controlName": {
  "controlType": "select",
  "label": "",
  "value": "",
  "order": 0,
  "options": [
    {
      "label": "Option 1",
      "value": "option1"
    },
    {
      "label": "Option 2",
      "value": "option2"
    },
  ]
  "validators": {}
},`;

export const baseCheckboxObject = `
"controlName": {
  "controlType": "checkbox",
  "label": "",
  "value": false,
  "order": 0,
  "validators": {}
},`;

export const baseGroupObject = `
"controlName": {
  "controlType": "group",
  "label": "",
  "order": 0,
  "controls": {}
},`;

export const validatorsObject = `
"validators": {
  "required": true,
  "email": true,
  "requiredTrue": true,
  "minLength": 2
}
`;

export const dynamicFormsTypes = `
import { Validators } from '@angular/forms';

export type DynamicOptions = {
  label: string;
  value: string;
};

type ValidatorKeys = keyof Omit<
  typeof Validators,
  'prototype' | 'compose' | 'composeAsync'
>;

export type ControlType = 'input' | 'select' | 'checkbox' | 'group';

export type DynamicBaseControl<T = string> = {
  controlType: ControlType;
  label: string;
  order: number;
  value: T | null;
  validators?: {
    [key in ValidatorKeys]?: unknown;
  };
};

export type DynamicInputControl = DynamicBaseControl & {
  controlType: 'input';
  type: string;
};

export type DynamicSelectControl = DynamicBaseControl & {
  controlType: 'select';
  options: DynamicOptions[];
};

export type DynamicCheckboxControl = DynamicBaseControl<boolean> & {
  controlType: 'checkbox';
};

export type DynamicGroupControl = Omit<
  DynamicBaseControl,
  'value' | 'validators'
> & {
  controlType: 'group';
  controls: { [key: string]: DynamicControl };
};

export type DynamicControl =
  | DynamicInputControl
  | DynamicSelectControl
  | DynamicCheckboxControl
  | DynamicGroupControl;

export type DynamicControlWithoutGroup = Exclude<
  DynamicControl,
  DynamicGroupControl
>;

export type DynamicFormConfig = {
  description: string;
  controls: {
    [key: string]: DynamicControl;
  };
};
`;

export const controlDataToken = `
import { InjectionToken } from '@angular/core';
import { DynamicControl } from './dynamic-forms.type';

export type ControlData<T extends DynamicControl = DynamicControl> = {
  controlKey: string;
  config: T;
};

export export const CONTROL_DATA = new InjectionToken<ControlData>('Control Data');
`;

export const baseDynamicControls = `
import { KeyValue } from '@angular/common';
import { StaticProvider, inject } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { DynamicValidatorMessageDirective } from '../../dynamic-form-errors/dynamic-validator-message.directive';
import { DynamicControl } from '../dynamic-forms.type';

export export const comparatorFn = (
  a: KeyValue<string, DynamicControl>,
  b: KeyValue<string, DynamicControl>,
): number => a.value.order - b.value.order;

export export const sharedDynamicControlDeps = [
  ReactiveFormsModule,
  DynamicValidatorMessageDirective,
];

export export const dynamicControlProvider: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => inject(ControlContainer, { skipSelf: true }),
};
`;

export const resolveValidators = `
import { Validators } from '@angular/forms';
import { DynamicControlWithoutGroup } from './dynamic-forms.type';

export function resolveValidators({
  validators = {},
}: DynamicControlWithoutGroup) {
  return (Object.keys(validators) as Array<keyof typeof validators>).map(
    (validatorKey) => {
      const validatorValue = validators[validatorKey];
      if (validatorKey === 'required') {
        return Validators.required;
      }
      if (validatorKey === 'email') {
        return Validators.email;
      }
      if (validatorKey === 'requiredTrue') {
        return Validators.requiredTrue;
      }
      if (validatorKey === 'minLength' && typeof validatorValue === 'number') {
        return Validators.minLength(validatorValue);
      }
      return Validators.nullValidator;
    },
  );
}
`;

export const dynamicInputComponent = `
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { CONTROL_DATA, ControlData } from '../control-data.token';
import { DynamicInputControl } from '../dynamic-forms.type';
import { resolveValidators } from '../resolve-validators';
import {
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [...sharedDynamicControlDeps, HlmInputDirective, HlmLabelDirective],
  viewProviders: [dynamicControlProvider],
  host: { class: 'mb-4 block' },
  template: \`
    <label hlmLabel [for]="control.controlKey">
      {{ control.config.label }}
    </label>
    <input
      hlmInput
      [formControlName]="control.controlKey"
      [value]="control.config.value"
      [id]="control.controlKey"
      [type]="control.config.type"
      class="w-full"
    />
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicInputComponent {
  protected control = inject(CONTROL_DATA) as ControlData<DynamicInputControl>;

  private formControl: AbstractControl = new FormControl(
    this.control.config.value,
    resolveValidators(this.control.config),
  );

  private parentGroupDir = inject(ControlContainer);

  constructor() {
    (this.parentGroupDir.control as FormGroup).addControl(
      this.control.controlKey,
      this.formControl,
    );
  }
}
`;

export const dynamicSelectComponent = `
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { CONTROL_DATA, ControlData } from '../control-data.token';
import { DynamicSelectControl } from '../dynamic-forms.type';
import { resolveValidators } from '../resolve-validators';
import {
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [
    ...sharedDynamicControlDeps,
    BrnSelectImports,
    HlmSelectImports,
    HlmLabelDirective,
  ],
  viewProviders: [dynamicControlProvider],
  host: { class: 'mb-4 block' },
  template: \`
    <label hlmLabel [for]="control.controlKey">
      {{ control.config.label }}
    </label>
    <brn-select
      [formControlName]="control.controlKey"
      [id]="control.controlKey"
    >
      <hlm-select-trigger class="w-full">
        <hlm-select-value />
      </hlm-select-trigger>
      <hlm-select-content>
        @for (option of control.config.options; track $index) {
          <hlm-option [value]="option.value">
            {{ option.label }}
          </hlm-option>
        }
      </hlm-select-content>
    </brn-select>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicSelectComponent {
  protected control = inject(CONTROL_DATA) as ControlData<DynamicSelectControl>;

  private formControl: AbstractControl = new FormControl(
    this.control.config.value,
    resolveValidators(this.control.config),
  );

  private parentGroupDir = inject(ControlContainer);

  constructor() {
    (this.parentGroupDir.control as FormGroup).addControl(
      this.control.controlKey,
      this.formControl,
    );
  }
}
`;

export const dynamicCheckboxComponent = `
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { ValidatorMessageContainerDirective } from '../../dynamic-form-errors/input-error/validator-message-container.directive';
import { CONTROL_DATA, ControlData } from '../control-data.token';
import { DynamicCheckboxControl } from '../dynamic-forms.type';
import { resolveValidators } from '../resolve-validators';
import {
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-checkbox',
  standalone: true,
  imports: [
    ...sharedDynamicControlDeps,
    ValidatorMessageContainerDirective,
    HlmCheckboxComponent,
  ],
  viewProviders: [dynamicControlProvider],
  host: { class: 'mb-4 block' },
  template: \`
    <label hlmLabel [for]="control.controlKey">
      <hlm-checkbox
        class="mr-2"
        [container]="containerDir.container"
        [formControlName]="control.controlKey"
        [checked]="control.config.value"
        [id]="control.controlKey"
      />
      {{ control.config.label }}
    </label>
    <ng-container
      validatorMessageContainerDirective
      #containerDir="validatorMessageContainerDirective"
    />
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicCheckboxComponent {
  protected control = inject(
    CONTROL_DATA,
  ) as ControlData<DynamicCheckboxControl>;

  private formControl: AbstractControl = new FormControl(
    this.control.config.value,
    resolveValidators(this.control.config),
  );

  private parentGroupDir = inject(ControlContainer);

  constructor() {
    (this.parentGroupDir.control as FormGroup).addControl(
      this.control.controlKey,
      this.formControl,
    );
  }
}
`;

export const dynamicGroupComponent = `
import { AsyncPipe, KeyValuePipe, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CONTROL_DATA, ControlData } from '../control-data.token';
import { ControlInjectorPipe } from '../control-injector.pipe';
import { DynamicControlResolverService } from '../dynamic-control-resolver.service';
import { DynamicGroupControl } from '../dynamic-forms.type';
import { comparatorFn, dynamicControlProvider } from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-group',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgComponentOutlet,
    AsyncPipe,
    KeyValuePipe,
    ControlInjectorPipe,
  ],
  viewProviders: [dynamicControlProvider],
  host: { class: 'mb-4 block' },
  template: \`
    <fieldset
      [formGroupName]="control.controlKey"
      class="rounded-md border border-border p-4"
    >
      <legend class="font-bold">{{ control.config.label }}</legend>
      @for (
        control of control.config.controls | keyvalue: comparatorFn;
        track control
      ) {
        <ng-container
          [ngComponentOutlet]="
            controlResolver.resolve(control.value.controlType) | async
          "
          [ngComponentOutletInjector]="
            control.key | controlInjector: control.value
          "
        />
      }
    </fieldset>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicGroupComponent {
  protected control = inject(CONTROL_DATA) as ControlData<DynamicGroupControl>;

  private formControl: AbstractControl = new FormGroup({});

  private parentGroupDir = inject(ControlContainer);

  protected controlResolver = inject(DynamicControlResolverService);
  protected comparatorFn = comparatorFn;

  constructor() {
    (this.parentGroupDir.control as FormGroup).addControl(
      this.control.controlKey,
      this.formControl,
    );
  }
}
`;

export const dynamicControlResolver = `
import { Injectable, Type } from '@angular/core';
import { from, of, tap } from 'rxjs';
import { DynamicControl } from './dynamic-forms.type';

type DynamicControlsMap = {
  [T in DynamicControl['controlType']]: () => Promise<Type<unknown>>;
};

@Injectable({
  providedIn: 'root',
})
export class DynamicControlResolverService {
  private lazyControlComponents: DynamicControlsMap = {
    input: () =>
      import('./dynamic-controls/dynamic-input.component').then(
        (c) => c.DynamicInputComponent,
      ),
    select: () =>
      import('./dynamic-controls/dynamic-select.component').then(
        (c) => c.DynamicSelectComponent,
      ),
    checkbox: () =>
      import('./dynamic-controls/dynamic-checkbox.component').then(
        (c) => c.DynamicCheckboxComponent,
      ),
    group: () =>
      import('./dynamic-controls/dynamic-group.component').then(
        (c) => c.DynamicGroupComponent,
      ),
  };
  private loadedControlComponents = new Map<string, Type<any>>();

  resolve(controlType: keyof DynamicControlsMap) {
    const loadedComponent = this.loadedControlComponents.get(controlType);
    if (loadedComponent) {
      return of(loadedComponent);
    }
    return from(this.lazyControlComponents[controlType]()).pipe(
      tap((comp) => this.loadedControlComponents.set(controlType, comp)),
    );
  }
}
`;

export const controlInjector = `
import { inject, Injector, Pipe, PipeTransform } from '@angular/core';
import { CONTROL_DATA } from './control-data.token';
import { DynamicControl } from './dynamic-forms.type';

@Pipe({
  name: 'controlInjector',
  standalone: true,
})
export class ControlInjectorPipe implements PipeTransform {
  private injector = inject(Injector);

  transform(
    controlKey: string,
    config: DynamicControl,
  ): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: CONTROL_DATA,
          useValue: { controlKey, config },
        },
      ],
    });
  }
}
`;

export const dynamicFormsPageComponent = `
import { AsyncPipe, KeyValuePipe, NgComponentOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlmH3 } from '@spartan-ng/ui-typography-helm';
import { map } from 'rxjs';
import { ControlInjectorPipe } from '../control-injector.pipe';
import { DynamicControlResolverService } from '../dynamic-control-resolver.service';
import { comparatorFn } from '../dynamic-controls/base-dynamic-control';
import { DynamicFormConfig } from '../dynamic-forms.type';

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
  ],
  template: \`
    @if (formConfig()) {
      <form
        class="w-[450px] rounded-md border border-border p-4"
        [formGroup]="formConfig()!.form"
        (ngSubmit)="onSubmit(formConfig()!.form)"
      >
        <h3 class="\${hlmH3} mb-4 inline-block">
          {{ formConfig()?.config?.description }}
        </h3>
        @for (
          control of formConfig()?.config?.controls | keyvalue: comparatorFn;
          track {}
        ) {
          <ng-container
            [ngComponentOutlet]="
              controlResolver.resolve(control.value.controlType) | async
            "
            [ngComponentOutletInjector]="
              control.key | controlInjector: control.value
            "
          />
        }
        <button
          hlmBtn
          [disabled]="(formConfig()?.form)!.invalid"
          class="w-full"
        >
          Save
        </button>
      </form>
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormsPageComponent {
  private http = inject(HttpClient);
  protected controlResolver = inject(DynamicControlResolverService);

  protected comparatorFn = comparatorFn;

  private formDir = viewChild.required(FormGroupDirective);

  protected formConfig = toSignal(
    this.http.get<DynamicFormConfig>(\`assets/form.json\`).pipe(
      map((config) => ({
        config,
        form: new FormGroup({}),
      })),
    ),
  );

  protected onSubmit(form: FormGroup) {
    console.log('Submitted data: ', form.getRawValue());
    this.formDir().resetForm();
  }
}
`;

export const validationErrorMessagesToken = `
import { InjectionToken } from '@angular/core';

export const ERROR_MESSAGES: { [key: string]: (args?: any) => string } = {
  required: () => \`This field is required\`,
  requiredTrue: () => \`This field is required\`,
  email: () => \`It should be a valid email\`,
  minlength: ({ requiredLength }) =>
    \`The length should be at least \${requiredLength} characters\`,
  pattern: () => \`Wrong format\`,
};

export const VALIDATION_ERROR_MESSAGES = new InjectionToken(
  \`Validation Messages\`,
  {
    providedIn: 'root',
    factory: () => ERROR_MESSAGES,
  },
);
`;

export const validationErrorMessageOverride = `
providers: [
  {
    provide: VALIDATION_ERROR_MESSAGES,
    useValue: {
      ...ERROR_MESSAGES,
      required: \`Your new error message.\`,
    },
  },
],
`;

export const errorMessagePipe = `
import { inject, Pipe, PipeTransform } from '@angular/core';
import { VALIDATION_ERROR_MESSAGES } from './input-error/validation-error-messages.token';

@Pipe({
  name: 'errorMessage',
  standalone: true,
})
export class ErrorMessagePipe implements PipeTransform {
  private errorMessages = inject(VALIDATION_ERROR_MESSAGES);

  transform(key: string, errValue: unknown): string {
    if (!this.errorMessages[key]) {
      console.warn(\`Missing message for \${key} validator...\`);
      return '';
    }
    return this.errorMessages[key](errValue);
  }
}
`;

export const inputErrorComponent = `
import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ErrorMessagePipe } from '../error-message.pipe';

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [KeyValuePipe, ErrorMessagePipe],
  template: \`
    @for (error of errors() | keyvalue; track $index) {
      <div class="text-red-500">
        {{ error.key | errorMessage: error.value }}
      </div>
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent {
  errors = input<ValidationErrors | undefined | null>(null);
}
`;

export const errorStateMatcherService = `
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

export type ErrorStateMatcher = {
  isErrorVisible(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean;
};

@Injectable({
  providedIn: 'root',
})
export class ErrorStateMatcherService implements ErrorStateMatcher {
  isErrorVisible(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null,
  ) {
    return Boolean(
      control && control.invalid && (control.dirty || (form && form.submitted)),
    );
  }
}
export class OnTouchedErrorStateMatcher implements ErrorStateMatcher {
  isErrorVisible(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null,
  ) {
    return Boolean(
      control &&
        control.invalid &&
        (control.touched || (form && form.submitted)),
    );
  }
}
`;

export const errorStateMatcherOverride = `
providers: [
  {
    provide: ErrorStateMatcherService,
    useClass: OnTouchedErrorStateMatcher,
  },
],
`;

export const errorStateMatcherAsInput = `
@Component({
  template: \`
    <input [errorStateMatcher]="showErrorStrategy" />
  \`,
})
export class SomeComponent {
  showErrorStrategy = new OnTouchedErrorStateMatcher();
}
`;

export const dynamicValidatorMessageDirective = `import {
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlContainer,
  FormGroupDirective,
  NgControl,
  NgForm,
  NgModel,
} from '@angular/forms';
import { EMPTY, fromEvent, iif, merge, skip, startWith } from 'rxjs';
import { ErrorStateMatcherService } from './input-error/error-state-matcher.service';
import { InputErrorComponent } from './input-error/input-error.component';

@Directive({
  selector: \`
    [ngModel]:not([withoutValidationErrors]),
    [formControl]:not([withoutValidationErrors]),
    [formControlName]:not([withoutValidationErrors]),
    [formGroupName]:not([withoutValidationErrors]),
    [ngModelGroup]:not([withoutValidationErrors])
  \`,
  standalone: true,
})
export class DynamicValidatorMessageDirective {
  private ngControl =
    inject(NgControl, { self: true, optional: true }) ||
    inject(ControlContainer, { self: true });
  private elementRef = inject(ElementRef);
  private parentContainer = inject(ControlContainer, { optional: true });
  private destroyRef = inject(DestroyRef);

  errorStateMatcher = input<ErrorStateMatcherService>(
    inject(ErrorStateMatcherService),
  );
  container = input<ViewContainerRef>(inject(ViewContainerRef));

  private form = this.parentContainer?.formDirective as
    | NgForm
    | FormGroupDirective
    | null;

  private componentRef: ComponentRef<InputErrorComponent> | null = null;

  constructor() {
    queueMicrotask(() => {
      if (!this.ngControl.control)
        throw Error(\`No control model for \${this.ngControl.name} control...\`);
      merge(
        this.ngControl.control.statusChanges,
        fromEvent(this.elementRef.nativeElement, 'blur'),
        iif(() => !!this.form, this.form!.ngSubmit, EMPTY),
      )
        .pipe(
          startWith(this.ngControl.control.status),
          skip(this.ngControl instanceof NgModel ? 1 : 0),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => {
          if (
            this.errorStateMatcher().isErrorVisible(
              this.ngControl.control,
              this.form,
            )
          ) {
            if (!this.componentRef) {
              this.componentRef =
                this.container().createComponent(InputErrorComponent);
              this.componentRef.changeDetectorRef.markForCheck();
            }
            this.componentRef.setInput('errors', this.ngControl.errors);
          } else {
            this.componentRef?.destroy();
            this.componentRef = null;
          }
        });
    });
  }
}
`;

export const validatorMessageContainerDirective = `
import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[validatorMessageContainerDirective]',
  standalone: true,
  exportAs: 'validatorMessageContainerDirective',
})
export class ValidatorMessageContainerDirective {
  container = inject(ViewContainerRef);
}
`;

export const validatorMessageContainerExample = `
<div>
  <input [container]="containerDir.container" />
</div>
<ng-container
  validatorMessageContainerDirective
  #containerDir="validatorMessageContainerDirective"
/>
`;
