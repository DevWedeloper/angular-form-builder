import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { routes } from '../../../../app.routes';
import { PageNavLinkComponent } from './page-nav-link.component';

describe('PageNavLinkComponent', () => {
  let component: PageNavLinkComponent;
  let fixture: ComponentFixture<PageNavLinkComponent>;
  let debugEl: DebugElement;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNavLinkComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(PageNavLinkComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.componentRef.setInput('fragment', '');
    fixture.componentRef.setInput('label', '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have relativeTo = activatedRoute', () => {
    const link = debugEl.query(By.css('[data-testingId="link"]'));

    expect(link.attributes['ng-reflect-relative-to']).toEqual(
      route.snapshot.pathFromRoot.toString(),
    );
  });

  it('should render fragment', () => {
    const fragment = 'Test';
    fixture.componentRef.setInput('fragment', fragment);
    fixture.detectChanges();

    const link = debugEl.query(By.css('[data-testingId="link"]'));

    expect(link.attributes['ng-reflect-fragment']).toEqual(fragment);
  });

  it('should render label', () => {
    const label = 'Test';
    fixture.componentRef.setInput('label', label);
    fixture.detectChanges();

    const linkEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="link"]'),
    ).nativeElement;

    expect(linkEl.textContent?.trim()).toEqual(label);
  });
});
