import { TestBed } from '@angular/core/testing';

import { DarkMode, ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set initial theme', () => {
    let value: DarkMode | undefined;
    service.darkMode$.subscribe((v) => (value = v));
    expect(value).toBeTruthy();
  });

  it('should properly set theme', () => {
    let value: DarkMode | undefined;
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    service.setDarkMode('dark');
    service.darkMode$.subscribe((v) => (value = v));
    expect(value).toBe('dark');
    expect(setItemSpy).toHaveBeenCalledWith('darkMode', 'dark');

    service.setDarkMode('light');
    service.darkMode$.subscribe((v) => (value = v));
    expect(value).toBe('light');
    expect(setItemSpy).toHaveBeenCalledWith('darkMode', 'light');

    service.setDarkMode('system');
    service.darkMode$.subscribe((v) => (value = v));
    expect(value).toBe('system');
    expect(setItemSpy).toHaveBeenCalledWith('darkMode', 'system');
  });
});
