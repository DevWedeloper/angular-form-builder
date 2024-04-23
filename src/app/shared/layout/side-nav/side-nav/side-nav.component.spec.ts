import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { SideNavContentComponent } from '../side-nav-content.component';
import { SideNavComponent } from './side-nav.component';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-side-nav-content component', () => {
    const sideNavContent = debugEl.query(By.directive(SideNavContentComponent));
    expect(sideNavContent).toBeTruthy();
  });
});
