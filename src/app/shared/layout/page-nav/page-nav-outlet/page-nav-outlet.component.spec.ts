import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, DebugElement, TemplateRef, viewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  PageNavOutletComponent,
  pageNavTemplate,
} from './page-nav-outlet.component';

describe('PageNavOutletComponent', () => {
  @Component({
    standalone: true,
    imports: [PageNavOutletComponent],
    template: `
      <ng-template #test><div data-testingId="test">test</div></ng-template>
      <app-page-nav-outlet />
    `,
  })
  class PageNavOutletTestHostComponent {
    testTpl = viewChild.required<TemplateRef<unknown>>('test');
  }

  let component: PageNavOutletComponent;
  let fixture: ComponentFixture<PageNavOutletComponent>;
  let pageNavOutletComponent: PageNavOutletTestHostComponent;
  let pageNavOutletFixture: ComponentFixture<PageNavOutletTestHostComponent>;
  let pageNavOutletDebugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNavOutletComponent],
      providers: [{ provide: pageNavTemplate }],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNavOutletComponent);
    component = fixture.componentInstance;
    pageNavOutletFixture = TestBed.createComponent(
      PageNavOutletTestHostComponent,
    );
    pageNavOutletComponent = pageNavOutletFixture.componentInstance;
    pageNavOutletDebugEl = pageNavOutletFixture.debugElement.query(
      By.directive(PageNavOutletComponent),
    );
    fixture.detectChanges();
    pageNavOutletFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly render content', () => {
    let pageNavOutlet = pageNavOutletDebugEl.query(
      By.css('[data-testingId="test"]'),
    );
    expect(pageNavOutlet).toBeFalsy();

    pageNavTemplate.set(pageNavOutletComponent.testTpl());
    pageNavOutletFixture.detectChanges();
    pageNavOutlet = pageNavOutletDebugEl.query(
      By.css('[data-testingId="test"]'),
    );
    expect(pageNavOutlet).toBeTruthy();

    pageNavTemplate.set(null);
    pageNavOutletFixture.detectChanges();
    pageNavOutlet = pageNavOutletDebugEl.query(
      By.css('[data-testingId="test"]'),
    );
    expect(pageNavOutlet).toBeFalsy();
  });
});
