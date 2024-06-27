import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { take } from 'rxjs';
import { ThemeService } from '../../theme/theme.service';
import { HeaderDarkModeComponent } from './header-dark-mode.component';

describe('HeaderDarkModeComponent', () => {
  let component: HeaderDarkModeComponent;
  let fixture: ComponentFixture<HeaderDarkModeComponent>;
  let debugEl: DebugElement;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderDarkModeComponent],
      providers: [BrnMenuTriggerDirective],
    }).compileComponents();

    themeService = TestBed.inject(ThemeService);

    fixture = TestBed.createComponent(HeaderDarkModeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display theme options when menu is opened', () => {
    const menuTriggerEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="menu-trigger"]'),
    ).nativeElement;
    const menuTriggerSpy = vi.spyOn(menuTriggerEl, 'click');

    menuTriggerEl.click();
    expect(menuTriggerSpy).toHaveBeenCalled();

    const lightEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="light"]'),
    ).nativeElement;
    expect(lightEl).toBeTruthy();

    const darkEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="dark"]'),
    ).nativeElement;
    expect(darkEl).toBeTruthy();

    const systemEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="system"]'),
    ).nativeElement;
    expect(systemEl).toBeTruthy();
  });

  it('should set correct theme', () => {
    const menuTriggerEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="menu-trigger"]'),
    ).nativeElement;
    menuTriggerEl.click();

    let currentTheme;
    const theme$ = themeService.darkMode$;

    const lightEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="light"]'),
    ).nativeElement;
    lightEl.click();

    theme$.pipe(take(1)).subscribe((theme) => {
      currentTheme = theme;
    });

    expect(currentTheme).toBe('light');

    const darkEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="dark"]'),
    ).nativeElement;
    darkEl.click();

    theme$.pipe(take(1)).subscribe((theme) => {
      currentTheme = theme;
    });

    expect(currentTheme).toBe('dark');

    const systemEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="system"]'),
    ).nativeElement;
    systemEl.click();

    theme$.pipe(take(1)).subscribe((theme) => {
      currentTheme = theme;
    });

    expect(currentTheme).toBe('system');
  });
});
