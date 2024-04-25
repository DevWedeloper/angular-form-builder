import { Component, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, Routes, provideRouter } from '@angular/router';
import { NavLinkDirective } from './nav-link.directive';

describe('NavLinkDirective', () => {
  @Component({
    standalone: true,
    imports: [NavLinkDirective],
    template: `
      <a appNavLink="/test">Link</a>
    `,
  })
  class TestHostComponent {}

  const routes: Routes = [
    {
      path: 'test',
      component: TestHostComponent,
    },
  ];

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let debugEl: DebugElement;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement.query(By.directive(NavLinkDirective));
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('appNavLink = routerLink', () => {
    const appNavLink = debugEl.attributes['appNavLink'];
    const routerLink = debugEl.attributes['ng-reflect-router-link'];
    expect(appNavLink).toBeTruthy();
    expect(routerLink).toBeTruthy();
    expect(appNavLink).toEqual(routerLink);
  });

  it('should set correct _hlmBtn variant', () => {
    const expectedClasses = [
      'underline-offset-4',
      'hover:underline',
      'text-primary',
    ];
    const navLinkEl: HTMLElement = debugEl.nativeElement;
    expectedClasses.forEach((expectedClass) => {
      expect(navLinkEl.classList).toContain(expectedClass);
    });
  });

  it('should set correct _hlmBtn size', () => {
    const expectedClasses = ['h-9', 'px-3', 'rounded-md'];
    const navLinkEl: HTMLElement = debugEl.nativeElement;
    expectedClasses.forEach((expectedClass) => {
      expect(navLinkEl.classList).toContain(expectedClass);
    });
  });

  it('should set correct _hlmBtn class', () => {
    const expectedClasses = ['opacity-70', 'font-medium'];
    const navLinkEl: HTMLElement = debugEl.nativeElement;
    expectedClasses.forEach((expectedClass) => {
      expect(navLinkEl.classList).toContain(expectedClass);
    });
  });

  it('should add necessary classes when routerLinkActive', fakeAsync(() => {
    const expectedClasses = ['!opacity-100'];
    const navLinkEl: HTMLElement = debugEl.nativeElement;
    expectedClasses.forEach((expectedClass) => {
      expect(navLinkEl.classList).not.toContain(expectedClass);
    });

    router.navigate(['test']);
    flush();
    expectedClasses.forEach((expectedClass) => {
      expect(navLinkEl.classList).toContain(expectedClass);
    });
  }));
});
