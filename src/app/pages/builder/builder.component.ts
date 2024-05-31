import { ChangeDetectionStrategy, Component } from '@angular/core';
import { hlmH4, hlmP } from '@spartan-ng/ui-typography-helm';
import { DynamicFormsPageComponent } from '../../shared/dynamic-forms/dynamic-forms-page/dynamic-forms-page.component';
import { PageNavOutletComponent } from '../../shared/layout/page-nav/page-nav-outlet/page-nav-outlet.component';
import { PageNavComponent } from '../../shared/layout/page-nav/page-nav/page-nav.component';
import { MainSectionDirective } from '../../shared/main-section.directive';
import { SectionIntroComponent } from '../../shared/section-intro/section-intro.component';
import { SectionSubHeadingComponent } from '../../shared/section-sub-heading/section-sub-heading.component';

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [
    PageNavComponent,
    PageNavOutletComponent,
    MainSectionDirective,
    SectionIntroComponent,
    SectionSubHeadingComponent,
    DynamicFormsPageComponent,
  ],
  template: `
    <section appMainSection>
      <app-section-intro
        name="Form Builder"
        lead="Build the configuration of a dynamic form."
      />

      <app-dynamic-forms-page />

      <app-section-sub-heading id="usage">Usage</app-section-sub-heading>
      <h3 id="usage__building-form" class="${hlmH4} mb-2 mt-6">
        Building Your Form
      </h3>
      <p class="${hlmP}">
        The form builder gives you complete control over your form's structure.
        You can easily add new fields, edit existing ones, and remove fields
        that are no longer needed.
      </p>
      <h3 id="usage__json-import-export" class="${hlmH4} mb-2 mt-6">
        Importing and Exporting Forms
      </h3>
      <p class="${hlmP}">
        Get a head start on your form creation by importing a pre-configured
        JSON file. This allows you to quickly build upon an existing structure.
        Once you've finished customizing your form, you can export it as a JSON
        file for easy sharing or future use.
      </p>
    </section>
    <app-page-nav />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderComponent {}
