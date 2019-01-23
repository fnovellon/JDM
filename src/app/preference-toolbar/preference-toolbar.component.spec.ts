import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceToolbarComponent } from './preference-toolbar.component';

describe('PreferenceToolbarComponent', () => {
  let component: PreferenceToolbarComponent;
  let fixture: ComponentFixture<PreferenceToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
