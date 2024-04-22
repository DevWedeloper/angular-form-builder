import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, DebugElement, viewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SectionSubHeadingComponent } from './section-sub-heading.component';

describe('SectionSubHeadingComponent', () => {
  @Component({
    standalone: true,
    imports: [SectionSubHeadingComponent],
    template: `<app-section-sub-heading>Test</app-section-sub-heading>`,
  })
  class TestHostComponent {
    sectionSubHeading = viewChild.required<SectionSubHeadingComponent>(
      SectionSubHeadingComponent,
    );
  }

  let fixture: ComponentFixture<SectionSubHeadingComponent>;
  let debugEl: DebugElement;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostDebugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionSubHeadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionSubHeadingComponent);
    debugEl = fixture.debugElement;
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostDebugEl = hostFixture.debugElement.query(
      By.directive(SectionSubHeadingComponent),
    );
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent.sectionSubHeading).toBeTruthy();
  });

  it('should properly render content', () => {
    const subHeadingEl: HTMLElement = hostDebugEl.nativeElement;
    expect(subHeadingEl.textContent?.trim()).toEqual('Test');
  });

  it('should add class -mt-12 to self if first is true', () => {
    const subHeadingEl: HTMLElement = debugEl.nativeElement;
    expect(subHeadingEl.classList).not.toContain('-mt-12');
    fixture.componentRef.setInput('first', true);
    fixture.detectChanges();
    expect(subHeadingEl.classList).toContain('-mt-12');
  });
});
