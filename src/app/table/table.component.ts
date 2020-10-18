import { Component, OnInit, ViewChild, Input, HostListener, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit, OnChanges {
  @Input() dataSource: MatTableDataSource<any>;
  @Input() columns: {columnDef: string;
    header: string;
    cell: (element: any) => string;
   total: string; }[];
  @Input() allowMultiSelect = false;
  @Input() filterEnable = false;
  @Input() hasFooter = true;
  @Input() hasFilter = false;
  @Input() selectionEnabled = false;
  @Input() isActive = true;

  displayedColumns: string[] = [];
  selection: SelectionModel<any>;
  initialSelection = [];

  @Output() selected = new EventEmitter<any>();
  @Output() contextmenuselected = new EventEmitter<any>();

  constructor() {
   }
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @HostListener('matSortChange', ['$event'])

  sortChange(e) {
    // save cookie with table sort data here
    this.paginator.firstPage();
  }

  enableSelection() {
    this.displayedColumns = ['select'];
    this.selection = new SelectionModel<any>(this.allowMultiSelect, this.initialSelection);
  }

  ngOnChanges(changes: SimpleChanges): void {
    changes.columns.currentValue
    .filter(column => this.displayedColumns.indexOf(column.columnDef) < 0)
    .map(column => this.displayedColumns.push(column.columnDef));
  }

  ngOnInit() {
    if (this.selectionEnabled) {
      this.enableSelection();
    }
    this.columns.filter(column => this.displayedColumns.indexOf(column.columnDef) < 0)
    .map(column => this.displayedColumns.push(column.columnDef));

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRecord(row) {
    this.emitSelection(row);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  emitSelection(row) {
    if (this.isActive) {
      if (this.selectionEnabled) {
        this.selection.toggle(row);
        this.selected.emit(this.selection.selected);
      } else {
        this.selected.emit(row);

      }
    }
  }

  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.contextmenuselected.emit({x: event.clientX, y: event.clientY , row: item});
  }
}
