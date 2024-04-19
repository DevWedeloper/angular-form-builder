import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SectionSubHeadingComponent } from './section-sub-heading.component';

describe('SectionSubHeadingComponent', () => {
  @Component({
    standalone: true,
    imports: [SectionSubHeadingComponent],
    template: `<app-section-sub-heading data-testingId="test-host"
      >Test</app-section-sub-heading
    >`,
  })
  class SectionSubHeadingTestHostComponent {}

  let component: SectionSubHeadingComponent;
  let fixture: ComponentFixture<SectionSubHeadingComponent>;
  let debugEl: DebugElement;
  let subHeadingFixture: ComponentFixture<SectionSubHeadingTestHostComponent>;
  let subHeadingDebugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionSubHeadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionSubHeadingComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    subHeadingFixture = TestBed.createComponent(
      SectionSubHeadingTestHostComponent,
    );
    subHeadingDebugEl = subHeadingFixture.debugElement.query(
      By.directive(SectionSubHeadingComponent),
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly render content', () => {
    const subHeadingEl: HTMLElement = subHeadingDebugEl.query(
      By.css('[data-testingId="sub-heading"]'),
    ).nativeElement;
    expect(subHeadingEl.textContent?.trim()).toEqual('Test');
  });

  it('should add class -mt-12 to self if first is true', () => {
    expect(debugEl.nativeElement.classList).not.toContain('-mt-12');
    fixture.componentRef.setInput('first', true);
    fixture.detectChanges();
    expect(debugEl.nativeElement.classList).toContain('-mt-12');
  });
});
