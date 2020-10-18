import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MbrSumUpComponent } from './mbr-sum-up.component';

describe('MbrSumUpComponent', () => {
  let component: MbrSumUpComponent;
  let fixture: ComponentFixture<MbrSumUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MbrSumUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MbrSumUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
