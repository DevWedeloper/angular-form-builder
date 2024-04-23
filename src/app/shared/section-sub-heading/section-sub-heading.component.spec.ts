import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, DebugElement, viewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SectionSubHeadingComponent } from './section-sub-heading.component';

describe('SectionSubHeadingComponent', () => {
  @Component({
    standalone: true,
    imports: [SectionSubHeadingComponent],
    template: `
      <app-section-sub-heading [first]="first">Test</app-section-sub-heading>
    `,
  })
  class TestHostComponent {
    sectionSubHeading = viewChild.required<SectionSubHeadingComponent>(
      SectionSubHeadingComponent,
    );
    first = false;
  }

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionSubHeadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement.query(
      By.directive(SectionSubHeadingComponent),
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.sectionSubHeading).toBeTruthy();
  });

  it('should properly render content', () => {
    const subHeadingEl: HTMLElement = debugEl.nativeElement;
    expect(subHeadingEl.textContent?.trim()).toEqual('Test');
  });

  it('should add class -mt-12 to self if first is true', () => {
    const subHeadingEl: HTMLElement = debugEl.nativeElement;
    expect(subHeadingEl.classList).not.toContain('-mt-12');

    component.first = true;
    fixture.detectChanges();
    expect(subHeadingEl.classList).toContain('-mt-12');
  });
});
