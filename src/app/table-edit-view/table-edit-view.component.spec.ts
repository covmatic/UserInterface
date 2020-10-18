import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEditViewComponent } from './table-edit-view.component';

describe('TableEditViewComponent', () => {
  let component: TableEditViewComponent;
  let fixture: ComponentFixture<TableEditViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableEditViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableEditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
