import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';

import { Clipboard } from '@angular/cdk/clipboard';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CodeComponent } from './code.component';

describe('CodeComponent', () => {
  let component: CodeComponent;
  let fixture: ComponentFixture<CodeComponent>;
  let debugEl: DebugElement;
  let clipboard: Clipboard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeComponent],
    }).compileComponents();

    clipboard = TestBed.inject(Clipboard);

    fixture = TestBed.createComponent(CodeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.componentRef.setInput('code', '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty content for empty code', () => {
    fixture.componentRef.setInput('code', '');
    fixture.detectChanges();

    const codeEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="code"]'),
    ).nativeElement;
    const codeContent = codeEl.querySelector('code')?.textContent;

    expect(codeContent).toEqual('');
  });

  it('should not render copy button when disableCopy is true', () => {
    fixture.componentRef.setInput('disableCopy', true);
    fixture.detectChanges();

    const copy = debugEl.query(By.css('[data-testingId="copy"]'));

    expect(copy).toBeNull();
  });

  it('should copy to clipboard', () => {
    const clipboardSpy = jest.spyOn(clipboard, 'copy');
    const text = 'hello world';
    fixture.componentRef.setInput('code', text);
    fixture.detectChanges();

    const copy = debugEl.query(By.css('[data-testingId="copy"]'));
    copy.nativeElement.click();

    expect(clipboardSpy).toHaveBeenCalledWith(text);
  });

  it('should change icon for 3 seconds after copying', fakeAsync(() => {
    const icon = debugEl.query(By.css('[data-testingId="icon"]'));
    const copy = debugEl.query(By.css('[data-testingId="copy"]'));

    const text = 'hello world';
    fixture.componentRef.setInput('code', text);
    fixture.detectChanges();

    expect(icon.attributes['ng-reflect-name']).toEqual('lucideClipboard');

    copy.nativeElement.click();

    tick(1000);
    fixture.detectChanges();
    expect(icon.attributes['ng-reflect-name']).toEqual('lucideCheck');

    tick(1000);
    fixture.detectChanges();
    expect(icon.attributes['ng-reflect-name']).toEqual('lucideCheck');

    tick(1000);
    fixture.detectChanges();
    expect(icon.attributes['ng-reflect-name']).toEqual('lucideClipboard');

    flush();
  }));
});
