import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, DebugElement, viewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { SideNavContentComponent } from './side-nav-content.component';

describe('SideNavContentComponent', () => {
  @Component({
    standalone: true,
    imports: [SideNavContentComponent],
    template: `
      <app-side-nav-content
        (linkClicked)="linkClicked()"
      ></app-side-nav-content>
    `,
  })
  class TestHostComponent {
    sideNavContent = viewChild.required(SideNavContentComponent);
    linkClicked() {}
  }

  const routes = [
    {
      path: 'builder',
      component: TestHostComponent,
    },
  ];

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavContentComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement.query(By.directive(SideNavContentComponent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.sideNavContent).toBeTruthy();
  });

  it('linkClicked should emit when link is clicked', () => {
    const linkClickedSpy = vi.spyOn(component, 'linkClicked');

    const linkEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="link"]'),
    ).nativeElement;
    linkEl.click();

    expect(linkClickedSpy).toHaveBeenCalledTimes(1);
  });
});
