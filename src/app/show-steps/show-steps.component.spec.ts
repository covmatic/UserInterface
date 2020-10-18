import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStepsComponent } from './show-steps.component';

describe('ShowStepsComponent', () => {
  let component: ShowStepsComponent;
  let fixture: ComponentFixture<ShowStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
