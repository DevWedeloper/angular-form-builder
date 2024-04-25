import { Component, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, Routes, provideRouter } from '@angular/router';
import { SideNavLinkDirective } from './side-nav-link.directive';

describe('SideNavLinkDirective', () => {
  @Component({
    standalone: true,
    imports: [SideNavLinkDirective],
    template: `
      <a appSideNavLink="/test" [disabled]="disabled">Link</a>
    `,
  })
  class TestHostComponent {
    disabled = false;
  }

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
    debugEl = fixture.debugElement.query(By.directive(SideNavLinkDirective));
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('appSideNavLink = routerLink', () => {
    const appSideNavLink = debugEl.attributes['appSideNavLink'];
    const routerLink = debugEl.attributes['ng-reflect-router-link'];
    expect(appSideNavLink).toBeTruthy();
    expect(routerLink).toBeTruthy();
    expect(appSideNavLink).toEqual(routerLink);
  });

  it('should set tabindex to -1 when disabled', () => {
    let tabindex = debugEl.attributes['tabindex'];
    expect(tabindex).toEqual('0');

    component.disabled = true;
    fixture.detectChanges();

    tabindex = debugEl.attributes['tabindex'];
    expect(tabindex).toEqual('-1');
  });

  describe('Add class', () => {
    it('should add necessary classes when disabled', () => {
      const expectedClasses = [
        '!text-zinc-300',
        'dark:!text-zinc-700',
        'pointer-events-none',
      ];
      const sideNavLinkEl: HTMLElement = debugEl.nativeElement;
      expectedClasses.forEach((expectedClass) => {
        expect(sideNavLinkEl.classList).not.toContain(expectedClass);
      });

      component.disabled = true;
      fixture.detectChanges();
      expectedClasses.forEach((expectedClass) => {
        expect(sideNavLinkEl.classList).toContain(expectedClass);
      });
    });

    it('should add necessary classes when routerLinkActive', fakeAsync(() => {
      const expectedClasses = ['font-medium', '!text-foreground'];
      const sideNavLinkEl: HTMLElement = debugEl.nativeElement;
      expectedClasses.forEach((expectedClass) => {
        expect(sideNavLinkEl.classList).not.toContain(expectedClass);
      });

      router.navigate(['test']);
      flush();
      expectedClasses.forEach((expectedClass) => {
        expect(sideNavLinkEl.classList).toContain(expectedClass);
      });
    }));
  });
});
