import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionIntroComponent } from './section-intro.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SectionIntroComponent', () => {
  let component: SectionIntroComponent;
  let fixture: ComponentFixture<SectionIntroComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionIntroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionIntroComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.componentRef.setInput('name', '');
    fixture.componentRef.setInput('lead', '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render name', () => {
    const name = 'Test';
    fixture.componentRef.setInput('name', name);
    fixture.detectChanges();

    const nameEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="name"]'),
    ).nativeElement;

    expect(nameEl.textContent?.trim()).toEqual(name);
  });

  it('should render lead', () => {
    const lead = 'Testable app';
    fixture.componentRef.setInput('lead', lead);
    fixture.detectChanges();

    const leadEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="lead"]'),
    ).nativeElement;

    expect(leadEl.textContent?.trim()).toEqual(lead);
  });
});
