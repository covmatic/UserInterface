import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MbrSumUpComponent } from '../mbr-sum-up/mbr-sum-up.component';
import { ShowPcrResultComponent } from '../show-pcr-result/show-pcr-result.component';
import { TableEditViewComponent } from '../table-edit-view/table-edit-view.component';

@Component({
  selector: 'app-table-tabs',
  templateUrl: './table-tabs.component.html',
  styleUrls: ['./table-tabs.component.css']
})
export class TableTabsComponent implements OnInit {
  @ViewChild('finished', {static: true}) finished: TableEditViewComponent;
  @ViewChild('approved', {static: true}) approved: TableEditViewComponent;


  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  onMBRSelected(row, endpoint?) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = '90vh';
    dialogConfig.data = {
      table: endpoint,
      values: row
    };
    const dialogRef = this.dialog.open(MbrSumUpComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(toUpdate => {
      if (toUpdate) {
        this.finished.update();
        this.approved.update();
      }
    });
  }

  onResultSelected(row) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = '90vh';
    dialogConfig.width = '1300px';
    dialogConfig.data = {
      values: row
    };
    const dialogRef = this.dialog.open(ShowPcrResultComponent, dialogConfig);
  }

}
