import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { StationsService, Card } from '../services/stations.service';

@Component({
  selector: 'app-mbr-sum-up',
  templateUrl: './mbr-sum-up.component.html',
  styleUrls: ['./mbr-sum-up.component.css']
})
export class MbrSumUpComponent implements OnInit {
  tasks: Card[];
  mbr: any;
  groups: {name: string, cards: Card[]}[];
  columns = ['task', 'instruction', 'operator', 'timestamp'];
  validator: { validator: string; timestamp: string; };

  constructor(
    private dialogRef: MatDialogRef<MbrSumUpComponent>,
    private stationService: StationsService,
    @Inject(MAT_DIALOG_DATA) public data: {values: {station: string;
      runId: string;
      timestamp: string};
      table: string}
    ) {
      this.mbr = data;
      this.stationService.getValidator(data.values.runId).subscribe(validator => {
        this.validator = validator;
      })
      this.stationService.getMBR(data.table, data.values.station, data.values.runId)
      .subscribe(tasks => {
        this.tasks = tasks;
        this.groups = this.tasks.reduce((k, e) => {
          if (k.length && e.groupName === k[k.length - 1].name) {
              k[k.length - 1].cards.push(e);
          } else {
            k.push({name: e.groupName, cards: [e]});
          }
          return k;
        }, []);
      });
     }

  ngOnInit(): void {
  }

  save() {
    this.stationService.approveMBR(this.mbr.values.station, this.mbr.values.runId)
    .subscribe(() => this.dialogRef.close(true));
  }

  close() {
    this.dialogRef.close(false);
  }
}
