import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { StationsService } from '../services/stations.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-edit-view',
  templateUrl: './table-edit-view.component.html',
  styleUrls: ['./table-edit-view.component.css']
})
export class TableEditViewComponent implements OnInit {
  @Input() endpoint: string;
  columns = [];
  dataSource: MatTableDataSource<any>;
  @Output() selected = new EventEmitter<any>();


  constructor(
    private stationService: StationsService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([]);
    this.stationService.getTable(this.endpoint).subscribe(res => {
      this.columns = Object.keys(res[0]).map(key => ({columnDef: key, header: key, cell: (element: any) => `${element[key]}`, total: 0}));
      this.dataSource.data = res;
    });
    }

  update(): void {
    this.stationService.getTable(this.endpoint).subscribe(res => {
      this.columns = Object.keys(res[0]).map(key => ({columnDef: key, header: key, cell: (element: any) => `${element[key]}`, total: 0}));
      this.dataSource.data = res;
    });
  }

  onSelection(selection) {
    this.selected.emit(selection);
  }
}
