import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, DebugElement, viewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { SectionIntroComponent } from '../../../section-intro/section-intro.component';
import { SectionSubHeadingComponent } from '../../../section-sub-heading/section-sub-heading.component';
import { PageNavLinkComponent } from '../page-nav-link/page-nav-link.component';
import {
  PageNavOutletComponent,
  pageNavTemplate,
} from '../page-nav-outlet/page-nav-outlet.component';
import { PageNavComponent } from './page-nav.component';

describe('PageNavComponent', () => {
  @Component({
    standalone: true,
    imports: [
      PageNavComponent,
      PageNavOutletComponent,
      SectionIntroComponent,
      SectionSubHeadingComponent,
    ],
    template: `
      <section appMainSection>
        <app-section-intro name="Test" lead="Testable" />
        <app-section-sub-heading id="h2-heading">
          H2 Heading
        </app-section-sub-heading>
        <h3 id="h3-heading">H3 Heading 1</h3>
        <h3 id="test-heading">H3 Heading 2</h3>
      </section>
      <app-page-nav />
      <app-page-nav-outlet />
    `,
  })
  class TestHostComponent {
    pageNav = viewChild.required<PageNavComponent>(PageNavComponent);
  }

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNavComponent],
      providers: [provideRouter([]), { provide: pageNavTemplate }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement.query(By.directive(PageNavOutletComponent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.pageNav).toBeTruthy();
  });

  it('should render content of page nav', () => {
    const pageNav = debugEl.query(By.css('[data-testingId="page-nav"]'));
    expect(pageNav).toBeTruthy();
  });

  it('should render correct amount of links', () => {
    const getLinks = debugEl.queryAll(By.directive(PageNavLinkComponent));
    expect(getLinks.length).toEqual(3);
  });

  it('should add class pl-4 when link is nested', () => {
    const getLinks = debugEl.queryAll(By.directive(PageNavLinkComponent));
    const targetLinkEl: HTMLElement = getLinks.find(
      (link) => link.attributes['ng-reflect-fragment'] === 'h3-heading',
    )?.nativeElement;
    expect(targetLinkEl.classList).toContain('pl-4');
  });

  it('should set pageNavTemplate', () => {
    expect(pageNavTemplate()).toBeTruthy();
  });

  it('should set pageNavTemplate to null on destroy', () => {
    expect(pageNavTemplate()).toBeTruthy();
    fixture.destroy();
    expect(pageNavTemplate()).toBeFalsy();
  });
});
