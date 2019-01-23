import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollToolbarComponent } from './scroll-toolbar.component';

describe('ScrollToolbarComponent', () => {
  let component: ScrollToolbarComponent;
  let fixture: ComponentFixture<ScrollToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrollToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
