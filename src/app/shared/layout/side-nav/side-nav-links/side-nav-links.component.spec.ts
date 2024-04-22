import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, DebugElement, viewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SideNavLinksComponent } from './side-nav-links.component';

describe('SideNavLinksComponent', () => {
  @Component({
    standalone: true,
    imports: [SideNavLinksComponent],
    template: `<app-side-nav-links>Test</app-side-nav-links>`,
  })
  class TestHostComponent {
    sideNavLinks = viewChild.required<SideNavLinksComponent>(
      SideNavLinksComponent,
    );
  }

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavLinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement.query(By.directive(SideNavLinksComponent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.sideNavLinks).toBeTruthy();
  });

  it('should properly render content', () => {
    const sideNavLinksEl: HTMLElement = debugEl.nativeElement;
    expect(sideNavLinksEl.textContent?.trim()).toEqual('Test');
  });
});
