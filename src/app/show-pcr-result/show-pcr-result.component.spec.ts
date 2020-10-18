import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPcrResultComponent } from './show-pcr-result.component';

describe('ShowPcrResultComponent', () => {
  let component: ShowPcrResultComponent;
  let fixture: ComponentFixture<ShowPcrResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPcrResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPcrResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
