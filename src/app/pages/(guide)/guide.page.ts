import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlmCode, hlmH4, hlmP, hlmUl } from '@spartan-ng/ui-typography-helm';
import { CodeComponent } from '../../shared/code/code.component';
import { PageNavOutletComponent } from '../../shared/layout/page-nav/page-nav-outlet/page-nav-outlet.component';
import { PageNavComponent } from '../../shared/layout/page-nav/page-nav/page-nav.component';
import { MainSectionDirective } from '../../shared/main-section.directive';
import { metaWith } from '../../shared/meta/meta.util';
import { SectionIntroComponent } from '../../shared/section-intro/section-intro.component';
import { SectionSubHeadingComponent } from '../../shared/section-sub-heading/section-sub-heading.component';
import {
  baseCheckboxObject,
  baseDynamicControls,
  baseGroupObject,
  baseInputObject,
  baseJSONObject,
  baseSelectObject,
  controlDataToken,
  controlInjector,
  dynamicCheckboxComponent,
  dynamicControlResolver,
  dynamicFormsPageComponent,
  dynamicFormsTypes,
  dynamicGroupComponent,
  dynamicInputComponent,
  dynamicSelectComponent,
  dynamicValidatorMessageDirective,
  errorMessagePipe,
  errorStateMatcherAsInput,
  errorStateMatcherOverride,
  errorStateMatcherService,
  inputErrorComponent,
  resolveValidators,
  validationErrorMessageOverride,
  validationErrorMessagesToken,
  validatorMessageContainerDirective,
  validatorMessageContainerExample,
  validatorsObject,
} from './guide-codes';

export const routeMeta: RouteMeta = {
  meta: metaWith(
    'Angular Form Builder - Guide',
    'Deep dive into building a dynamic form.',
  ),
  title: 'Guide | Angular Form Builder',
};

const guideLink = 'h-6 px-0.5 text-base underline';

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [
    PageNavComponent,
    PageNavOutletComponent,
    MainSectionDirective,
    SectionIntroComponent,
    SectionSubHeadingComponent,
    CodeComponent,
    HlmButtonDirective,
  ],
  template: `
    <section appMainSection>
      <app-section-intro
        name="Guide"
        lead="Deep dive into building a dynamic form."
      />

      <app-section-sub-heading id="overview">Overview</app-section-sub-heading>
      <p class="${hlmP}">
        Dynamic forms are a powerful tool in Angular for situations where you
        need to create forms with a similar structure but varying content, like
        questionnaires or quizzes. This approach allows you to define the form's
        shape using a JSON object, making it faster and easier to generate new
        versions. With dynamic forms, you can modify the questions on the fly
        without changing the application code itself. To learn more about
        building dynamic forms and their functionalities, check out this
        <a
          class="${guideLink}"
          hlmBtn
          href="https://angular.dev/guide/forms/dynamic-forms"
          target="_blank"
          variant="link"
        >
          in-depth resource
        </a>
        from Angular.
      </p>

      <app-section-sub-heading id="defining-the-object">
        Defining the object
      </app-section-sub-heading>
      <p class="${hlmP}">
        This section lays the groundwork for our dynamic form by defining its
        structure in a JSON object. This object acts as a blueprint, specifying
        the type and properties of each form element. We'll also create a
        corresponding TypeScript types to ensure type safety.
      </p>

      <h3 id="defining-the-object__JSON" class="${hlmH4} mb-2 mt-6">JSON</h3>
      <p class="${hlmP} mb-4">
        This would be the base JSON object for our form. The description could
        contain the title of the form. Inside the controls object, we'll specify
        the type and properties of each form element.
      </p>
      @defer {
        <app-code [code]="baseJSONObject" />
      }

      <p class="${hlmP} mb-4">
        In this example we would have four types of form fields, input, select,
        checkbox, and group. We'll be defining their shape.
      </p>
      <p class="${hlmP} mb-4">Input:</p>
      @defer {
        <app-code [code]="baseInputObject" />
      }

      <p class="${hlmP} mb-4">Select:</p>
      @defer {
        <app-code [code]="baseSelectObject" />
      }

      <p class="${hlmP} mb-4">Checkbox:</p>
      @defer {
        <app-code [code]="baseCheckboxObject" />
      }

      <p class="${hlmP} mb-4">Group:</p>
      @defer {
        <app-code [code]="baseGroupObject" />
      }

      <p class="${hlmP} mb-4">
        The validators object is optional. But it is where we would resolve
        Angular validators. An example validators object is shown below. While
        this example includes all the validators used in this guide, it might
        not be the most practical. It serves to demonstrate the syntax of each
        validator.
      </p>
      @defer {
        <app-code [code]="validatorsObject" />
      }

      <h3 id="defining-the-object__types" class="${hlmH4} mb-2 mt-6">Types</h3>
      <p class="${hlmP}">
        This is where we'll define the types based on the shape of the object.
        The types will essentially mirror the structure of the object,
        specifying the expected data type for each property.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-forms/dynamic-forms.type.ts
        </code>
      </p>
      @defer {
        <app-code [code]="dynamicFormsTypes" />
      }

      <p class="${hlmP}">
        We omit prototype, compose, and composeAsync from the type
        <code class="${hlmCode}">ValidatorKeys</code>
        as they are not validators. These functions serve other purposes within
        the Angular framework and are not relevant to form validation.
      </p>
      <p class="${hlmP} mb-4">
        You might notice that
        <code class="${hlmCode}">DynamicGroupControl</code>
        is the only type that includes validators. To handle scenarios where
        validators are not needed, we've also defined the type
        <code class="${hlmCode}">DynamicControlWithoutGroup</code>
        . We'll utilize this type later on when resolving validators.
      </p>

      <app-section-sub-heading id="creating-form-building-blocks">
        Creating form building blocks
      </app-section-sub-heading>
      <p class="${hlmP}">
        This section dives into creating the building blocks for our dynamic
        form. Here, we'll develop reusable components based on the defined
        <code class="${hlmCode}">controlTypes</code>
        . These components will serve as the fundamental elements that make up
        the different form fields.
      </p>

      <h3
        id="creating-form-building-blocks__creating-injection-token"
        class="${hlmH4} mb-2 mt-6"
      >
        Creating injection token
      </h3>
      <p class="${hlmP}">
        We'll create an injection token to hold the necessary data for each
        dynamic control. This data will be injected later using dependency
        injection.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-forms/control-data.token.ts
        </code>
      </p>
      @defer {
        <app-code [code]="controlDataToken" />
      }

      <p class="${hlmP} mb-4">
        We use a generic type defaulting to
        <code class="${hlmCode}">DynamicControl</code>
        . This enables us to employ type assertions on each dynamic control
        component, guaranteeing we use the appropriate type.
      </p>

      <h3
        id="creating-form-building-blocks__common-functionality"
        class="${hlmH4} mb-2 mt-6"
      >
        Common functionality
      </h3>
      <p class="${hlmP}">
        These are the common functionalities that would be used in our dynamic
        control components.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-forms/dynamic-controls/base-dynamic-control.ts
        </code>
      </p>
      @defer {
        <app-code [code]="baseDynamicControls" />
      }

      <p class="${hlmP}">
        We'll be creating the
        <code class="${hlmCode}">DynamicValidatorMessageDirective</code>
        later in this guide. This directive will be used to display validation
        errors.
      </p>
      <p class="${hlmP}">
        The
        <code class="${hlmCode}">comparatorFn</code>
        would be used to display the controls in order.
      </p>
      <p class="${hlmP}">
        The
        <code class="${hlmCode}">dynamicControlProvider</code>
        is essential for defining controls outside the view of a form group.
        Without it, you'll encounter the error
        <code class="${hlmCode}">
          NG01050: formControlName must be used with a parent formGroup
          directive.
        </code>
        We also use
        <code class="${hlmCode}">&#123; skipSelf: true &#125;</code>
        so that it resolves the dependency from the parent injector. This is
        crucial for nested forms (forms that have another formGroup inside of
        it) to avoid errors.
      </p>
      <p class="${hlmP} mb-4">
        We must also provide the
        <code class="${hlmCode}">dynamicControlProvider</code>
        via
        <code class="${hlmCode}">viewProviders</code>
        . By default, Angular restricts
        <code class="${hlmCode}">ControlContainer</code>
        provider resolution only within the component's view where the
        <code class="${hlmCode}">formControlName</code>
        directive is declared. This means Angular won't look for providers
        beyond that view, even if we defined them elsewhere.
        <code class="${hlmCode}">viewProviders</code>
        work because Angular checks them before the
        <code class="${hlmCode}">ControlContainer</code>
        resolution fails, unlike regular providers in this context.
      </p>

      <h3
        id="creating-form-building-blocks__resolving-validators"
        class="${hlmH4} mb-2 mt-6"
      >
        Resolving Validators
      </h3>
      <p class="${hlmP}">
        Before we delve into creating dynamic control components, let's explore
        how we'll resolve control validators.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-forms/resolve-validators.ts
        </code>
      </p>
      @defer {
        <app-code [code]="resolveValidators" />
      }

      <p class="${hlmP} mb-4">
        This function iterates through the validators object and tries to
        convert each key into a corresponding Angular validator.
      </p>

      <h3
        id="creating-form-building-blocks__dynamic-components"
        class="${hlmH4} mb-2 mt-6"
      >
        Dynamic Components
      </h3>
      <p class="${hlmP} mb-4">
        This guide uses the spartan-ng library. However, you have the
        flexibility to choose a different library that aligns with your
        project's requirements, or even create your own custom implementation.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-forms/dynamic-controls/dynamic-input.component.ts
        </code>
      </p>
      @defer {
        <app-code [code]="dynamicInputComponent" />
      }

      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-forms/dynamic-controls/dynamic-select.component.ts
        </code>
      </p>
      @defer {
        <app-code [code]="dynamicSelectComponent" />
      }

      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-forms/dynamic-controls/dynamic-checkbox.component.ts
        </code>
      </p>
      @defer {
        <app-code [code]="dynamicCheckboxComponent" />
      }

      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-forms/dynamic-controls/dynamic-group.component.ts
        </code>
      </p>
      @defer {
        <app-code [code]="dynamicGroupComponent" />
      }

      <p class="${hlmP}">
        As you've seen, this pattern of injecting
        <code class="${hlmCode}">CONTROL_DATA</code>
        and adding the control to the ControlContainer repeats across dynamic
        control components. While creating a reusable class might seem like a
        way to avoid code duplication, it would prevent us from using type
        assertions, which are essential for ensuring type safety.
      </p>
      <p class="${hlmP} mb-4">
        The dynamic group component utilizes
        <code class="${hlmCode}">controlInjector</code>
        and
        <code class="${hlmCode}">controlResolver</code>
        . We'll delve into these concepts in the next section.
      </p>

      <app-section-sub-heading id="resolving-the-form">
        Resolving the form
      </app-section-sub-heading>
      <p class="${hlmP}">
        Here, we'll explore the final steps involved in setting up and resolving
        the form, making it ready for user interaction and data submission.
      </p>

      <h3
        id="resolving-the-form__lazy-loading-dynamic-components"
        class="${hlmH4} mb-2 mt-6"
      >
        Lazy Loading Dynamic Components
      </h3>
      <p class="${hlmP}">
        We lazy load controls based on their
        <code class="${hlmCode}">controlType</code>
        to avoid loading unused components and improve performance.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-forms/dynamic-control-resolver.service.ts
        </code>
      </p>
      @defer {
        <app-code [code]="dynamicControlResolver" />
      }

      <p class="${hlmP} mb-4">
        The resolve function acts like a cache for dynamic control components.
        It first checks if the component for a given type is already loaded. If
        so, it returns it immediately. Otherwise, it fetches the component.
      </p>

      <h3
        id="resolving-the-form__injecting-control-data"
        class="${hlmH4} mb-2 mt-6"
      >
        Injecting control data
      </h3>
      <p class="${hlmP}">
        To populate our dynamic control components with data, we'll leverage
        dependency injection. This technique allows us to access the
        <code class="${hlmCode}">CONTROL_DATA</code>
        injection token, which provides the necessary data for each control.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-forms/control-injector.pipe.ts
        </code>
      </p>
      @defer {
        <app-code [code]="controlInjector" />
      }

      <h3 id="resolving-the-form__creating-the-form" class="${hlmH4} mb-2 mt-6">
        Creating the form
      </h3>
      <p class="${hlmP}">
        Assuming the JSON object is located at
        <code class="${hlmCode}">src/assets/form.json</code>
        we'll demonstrate how to use it to create the form.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-forms/dynamic-forms-page/dynamic-forms-page.component.ts
        </code>
      </p>
      @defer {
        <app-code [code]="dynamicFormsPageComponent" />
      }

      <p class="${hlmP}">
        Similar to how we resolve controls within the
        <code class="${hlmCode}">DynamicGroupComponent</code>
        we leverage
        <code class="${hlmCode}">NgComponentOutlet</code>
        to project the content (a component in this case). Likewise,
        <code class="${hlmCode}">NgComponentOutletInjector</code>
        is used to inject the necessary dependencies into the projected
        component.
      </p>
      <p class="${hlmP} mb-4">
        Avoid using the track in the for loop. While it might not be crucial in
        this scenario where the form is generated only once, using track can
        lead to inconsistencies if you manipulate form controls (adding,
        editing, removing) from the formConfig object. Instead, re-register the
        controls whenever the formConfig object is modified.
      </p>

      <app-section-sub-heading id="dynamic-error-handling">
        Dynamic Error Handling
      </app-section-sub-heading>
      <p class="${hlmP}">
        This section covers techniques for displaying and managing validation
        errors within your forms.
      </p>

      <h3
        id="dynamic-error-handling__resolving-error-messages"
        class="${hlmH4} mb-2 mt-6"
      >
        Resolving error messages
      </h3>
      <p class="${hlmP}">
        We'll be using dependency injection to resolve error messages. You might
        wonder why we wouldn't just hardcode them. While that's possible,
        dependency injection offers the benefit of message customization.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-form-errors/input-error/validation-error-messages.token.ts
        </code>
      </p>
      @defer {
        <app-code [code]="validationErrorMessagesToken" />
      }

      <p class="${hlmP} mb-4">
        We use function as value so we could provide parameters that make the
        message more descriptive.
      </p>
      <p class="${hlmP} mb-4">
        This is an example of how we can override the default error messages.
      </p>
      @defer {
        <app-code [code]="validationErrorMessageOverride" class="mb-4" />
      }

      <p class="${hlmP}">
        While using a pipe to match the appropriate error message is optional,
        it improves code readability. Additionally, a console warning is
        triggered if a key doesn't match any defined error message.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-form-errors/error-message.pipe.ts
        </code>
      </p>
      @defer {
        <app-code [code]="errorMessagePipe" class="mb-4" />
      }

      <p class="${hlmP}">
        This component handles error display. We'll explore how to use it later.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-form-errors/input-error/input-error.component.ts
        </code>
      </p>
      @defer {
        <app-code [code]="inputErrorComponent" />
      }

      <h3
        id="dynamic-error-handling__error-state-matcher-strategy"
        class="${hlmH4} mb-2 mt-6"
      >
        Error state matcher strategy
      </h3>
      <p class="${hlmP}">
        This service determines whether or not to display error messages in our
        forms. We'll delve into its usage later.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-form-errors/input-error/error-state-matcher.service.ts
        </code>
      </p>
      @defer {
        <app-code [code]="errorStateMatcherService" class="mb-4" />
      }

      <p class="${hlmP} mb-4">
        Dependency injection allows us to easily switch between different error
        state matcher strategies.
      </p>
      @defer {
        <app-code [code]="errorStateMatcherOverride" class="mb-4" />
      }

      <p class="${hlmP} mb-4">
        In cases where you only want to change the default error state matcher
        for specific fields, rather than the entire component, you can do the
        following.
      </p>
      @defer {
        <app-code [code]="errorStateMatcherAsInput" />
      }

      <p class="${hlmP} mb-4">
        The directive we'll create in the next section will accept this custom
        error state matcher as an input.
      </p>

      <h3
        id="dynamic-error-handling__error-creating-the-error-handler"
        class="${hlmH4} mb-2 mt-6"
      >
        Creating the error handler
      </h3>
      <p class="${hlmP}">
        This section dives into the details of creating the error handler.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-form-errors/dynamic-validator-message.directive.ts
        </code>
      </p>
      @defer {
        <app-code [code]="dynamicValidatorMessageDirective" />
      }

      <p class="${hlmP}">
        The selector eliminates the need to manually write a directive for each
        control. Simply import this directive, and you're set! Additionally, you
        have the option to opt out using the
        <code class="${hlmCode}">withoutValidationErrors</code>
        property.
      </p>
      <p class="${hlmP}">
        We inject the
        <code class="${hlmCode}">NgControl</code>
        . However, since we're also using
        <code class="${hlmCode}">formGroup</code>
        (which uses
        <code class="${hlmCode}">ControlContainer</code>
        ), we make the
        <code class="${hlmCode}">NgControl</code>
        <code class="${hlmCode}">optional</code>
        . If
        <code class="${hlmCode}">NgControl</code>
        isn't provided, we inject
        <code class="${hlmCode}">ControlContainer</code>
        instead. We also use
        <code class="${hlmCode}">self</code>
        so the injection comes from the directive injector.
      </p>
      <p class="${hlmP}">
        We inject the
        <code class="${hlmCode}">ControlContainer</code>
        to access the form's submit status later. Additionally, making this
        injection
        <code class="${hlmCode}">optional</code>
        allows the directive to work with standalone form controls as well.
      </p>
      <p class="${hlmP}">
        The container input could be used to render the error on a custom view
        slot.
      </p>
      <p class="${hlmP}">
        We would be using the
        <code class="${hlmCode}">ValidatorMessageContainerDirective</code>
        to get a reference on the slot we want to display the error message.
      </p>
      <p class="${hlmP} mb-4">
        <code class="${hlmCode}">
          src/app/shared/dynamic-form-errors/input-error/validator-message-container.directive.ts
        </code>
      </p>
      @defer {
        <app-code [code]="validatorMessageContainerDirective" class="mb-4" />
      }

      <p class="${hlmP} mb-4">
        We use
        <code class="${hlmCode}">exportAs</code>
        to get the instance of the directive instead of the native element.
      </p>
      @defer {
        <app-code [code]="validatorMessageContainerExample" class="mb-4" />
      }

      <p class="${hlmP} mb-4">
        Here is an example on how we could the
        <code class="${hlmCode}">ValidatorMessageContainerDirective</code>
        along with the
        <code class="${hlmCode}">exportAs</code>
        string.
      </p>
      <p class="${hlmP} mb-4">
        We use
        <code class="${hlmCode}">queueMicrotask</code>
        because
        <code class="${hlmCode}">ngModelGroup</code>
        controls are resolved asynchronously. But since we create the observable
        stream in the constructor instead of
        <code class="${hlmCode}">OnInit</code>
        , we need to use it regardless.
      </p>
      <p class="${hlmP}">
        We combine the following triggers to know when to check if we have to
        display an error or not.
      </p>
      <ul class="${hlmUl}">
        <li>
          <code class="${hlmCode}">this.ngControl.control.statusChanges</code>
          : For when the status changes.
        </li>
        <li>
          <code class="${hlmCode}">
            fromEvent(this.elementRef.nativeElement, 'blur')
          </code>
          : For when the user focuses on a field.
        </li>
        <li>
          <code class="${hlmCode}">
            iif(() => !!this.form, this.form!.ngSubmit, EMPTY)
          </code>
          : If the form exists, listen to the submit event, otherwise do not.
        </li>
      </ul>
      <p class="${hlmP}">
        We use
        <code class="${hlmCode}">startWith</code>
        to immediately emit the initial status of the control (
        <code class="${hlmCode}">this.ngControl.control.status</code>
        ) in the stream. This is necessary because reactive forms don't emit a
        status by default. However, in template-driven forms, using startWith
        would cause a double emission. To address this, we leverage the
        conditional operator
        <code class="${hlmCode}">
          (this.ngControl instanceof NgModel ? skip(1) : 0)
        </code>
        . This skips the first emission only if we're working with a
        template-driven form, ensuring correct behavior for both form types.
      </p>
      <p class="${hlmP}">
        If the
        <code class="${hlmCode}">errorStateMatcher</code>
        matches: create the
        <code class="${hlmCode}">InputErrorComponent</code>
        only if it doesn't yet exist. It then sets the components errors input.
        If the
        <code class="${hlmCode}">errorStateMatcher</code>
        does not match then delete the component.
      </p>
    </section>
    <app-page-nav />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GuideComponent {
  protected readonly baseJSONObject = baseJSONObject;
  protected readonly baseInputObject = baseInputObject;
  protected readonly baseSelectObject = baseSelectObject;
  protected readonly baseCheckboxObject = baseCheckboxObject;
  protected readonly baseGroupObject = baseGroupObject;
  protected readonly validatorsObject = validatorsObject;
  protected readonly dynamicFormsTypes = dynamicFormsTypes;
  protected readonly controlDataToken = controlDataToken;
  protected readonly baseDynamicControls = baseDynamicControls;
  protected readonly resolveValidators = resolveValidators;
  protected readonly dynamicInputComponent = dynamicInputComponent;
  protected readonly dynamicSelectComponent = dynamicSelectComponent;
  protected readonly dynamicCheckboxComponent = dynamicCheckboxComponent;
  protected readonly dynamicGroupComponent = dynamicGroupComponent;
  protected readonly dynamicControlResolver = dynamicControlResolver;
  protected readonly controlInjector = controlInjector;
  protected readonly dynamicFormsPageComponent = dynamicFormsPageComponent;
  protected readonly validationErrorMessagesToken =
    validationErrorMessagesToken;
  protected readonly validationErrorMessageOverride =
    validationErrorMessageOverride;
  protected readonly errorMessagePipe = errorMessagePipe;
  protected readonly inputErrorComponent = inputErrorComponent;
  protected readonly errorStateMatcherService = errorStateMatcherService;
  protected readonly errorStateMatcherOverride = errorStateMatcherOverride;
  protected readonly errorStateMatcherAsInput = errorStateMatcherAsInput;
  protected readonly dynamicValidatorMessageDirective =
    dynamicValidatorMessageDirective;
  protected readonly validatorMessageContainerDirective =
    validatorMessageContainerDirective;
  protected readonly validatorMessageContainerExample =
    validatorMessageContainerExample;
}
