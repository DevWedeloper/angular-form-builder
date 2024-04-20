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
  class TestHostComponent {
    testTpl = viewChild.required<TemplateRef<unknown>>('test');
    pageNavOutlet = viewChild.required<PageNavOutletComponent>(
      PageNavOutletComponent,
    );
  }

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNavOutletComponent],
      providers: [{ provide: pageNavTemplate }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement.query(By.directive(PageNavOutletComponent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.pageNavOutlet).toBeTruthy();
  });

  it('should properly render content', () => {
    let test = debugEl.query(By.css('[data-testingId="test"]'));
    expect(test).toBeFalsy();

    pageNavTemplate.set(component.testTpl());
    fixture.detectChanges();
    test = debugEl.query(By.css('[data-testingId="test"]'));
    expect(test).toBeTruthy();

    pageNavTemplate.set(null);
    fixture.detectChanges();
    test = debugEl.query(By.css('[data-testingId="test"]'));
    expect(test).toBeFalsy();
  });
});
