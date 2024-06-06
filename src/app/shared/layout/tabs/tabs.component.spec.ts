import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, DebugElement, viewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TabsComponent } from './tabs.component';

describe('TabsComponent', () => {
  @Component({
    standalone: true,
    imports: [TabsComponent],
    template: `
      <app-tabs
        firstTab="First Tab"
        secondTab="Second Tab"
        [value]="value"
        (tabActivated)="onTabActivated($event)"
      >
        <div firstTab>First Tab Content</div>
        <div secondTab>Second Tab Content</div>
      </app-tabs>
    `,
  })
  class TestHostComponent {
    tabs = viewChild.required(TabsComponent);
    value = '';
    tabActivatedValue = '';

    onTabActivated(value: string) {
      this.tabActivatedValue = value;
    }
  }

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement.query(By.directive(TabsComponent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Button text', () => {
    it('should render first tab button text', () => {
      const firstTabBtnEl: HTMLElement = debugEl.query(
        By.css('[data-testingId="first-tab"]'),
      ).nativeElement;
      expect(firstTabBtnEl.textContent?.trim()).toEqual('First Tab');
    });

    it('should render second tab button text', () => {
      const secondTabBtnEl: HTMLElement = debugEl.query(
        By.css('[data-testingId="second-tab"]'),
      ).nativeElement;
      expect(secondTabBtnEl.textContent?.trim()).toEqual('Second Tab');
    });
  });

  describe('Content', () => {
    it('should show correct tab content', () => {
      const firstTabContent = debugEl.query(
        By.css('[data-testingId="first-tab-content"]'),
      );
      expect(firstTabContent.attributes['hidden']).toBeFalsy();

      const secondTabContent = debugEl.query(
        By.css('[data-testingId="second-tab-content"]'),
      );
      expect(secondTabContent.attributes['hidden']).toEqual('');

      const secondTabEl: HTMLElement = debugEl.query(
        By.css('[data-testingId="second-tab"]'),
      ).nativeElement;
      secondTabEl.click();
      fixture.detectChanges();
      expect(firstTabContent.attributes['hidden']).toEqual('');
      expect(secondTabContent.attributes['hidden']).toBeFalsy();

      const firstTabEl: HTMLElement = debugEl.query(
        By.css('[data-testingId="first-tab"]'),
      ).nativeElement;
      firstTabEl.click();
      fixture.detectChanges();
      expect(firstTabContent.attributes['hidden']).toBeFalsy();
      expect(secondTabContent.attributes['hidden']).toEqual('');
    });

    it('should show correct tab based on value', () => {
      const firstTabContent = debugEl.query(
        By.css('[data-testingId="first-tab-content"]'),
      );
      const secondTabContent = debugEl.query(
        By.css('[data-testingId="second-tab-content"]'),
      );

      component.value = 'Second Tab';
      fixture.detectChanges();
      expect(firstTabContent.attributes['hidden']).toEqual('');
      expect(secondTabContent.attributes['hidden']).toBeFalsy();

      component.value = 'First Tab';
      fixture.detectChanges();
      expect(firstTabContent.attributes['hidden']).toBeFalsy();
      expect(secondTabContent.attributes['hidden']).toEqual('');
    });
  });

  it('should trigger tabActivated', () => {
    const firstTabEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="first-tab"]'),
    ).nativeElement;
    firstTabEl.click();
    fixture.detectChanges();
    expect(component.tabActivatedValue).toEqual('First Tab');

    const secondTabEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="second-tab"]'),
    ).nativeElement;
    secondTabEl.click();
    fixture.detectChanges();
    expect(component.tabActivatedValue).toEqual('Second Tab');
  });
});
