import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StationsService, Group, Task, Card } from '../services/stations.service';
import { AutomationService } from '../services/automation.service';
import { FormControl, Validators } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-show-steps',
  templateUrl: './show-steps.component.html',
  styleUrls: ['./show-steps.component.css']
})

export class ShowStepsComponent implements OnInit {
  runId = '';
  protocol: Array<Group>;
  cards: Array<Card> = [];
  isTaskRunning = false;
  taskMessage = '';
  idx = 0;
  station: string;
  inputText = new FormControl(null, Validators.required);
  readBarcode = false;
  hasInput = false;
  readSenderID = false;
  senderID: string;
  protocolName: string;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private stationsService: StationsService,
    private automationService: AutomationService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.station = params.get('station');
      this.protocolName = params.get('protocol');

      this.stationsService.getProtocolForStation(this.station).subscribe(protocol => {
        this.stationsService.stationIsCalibrated(this.station).subscribe(isCalibrated => {
          if (!isCalibrated) {
            const dialogRef = this.dialog.open(CalibrationDialogComponent, {
              width: '250px',
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe(ok => {
              if (ok) {
                this.stationsService.stationHasBeenCalibrated(this.station).subscribe();
              }
            });
          }
          protocol.forEach(group =>
            group.tasks.forEach(task =>
              this.cards.push(this.writeCard(task, group.name))));
          this.protocol = protocol;
        });
      },
        () => this.router.navigate(['']));
    });
  }

  writeCard(task: Task, group: string): Card {
    const card: Card = {
      action: task.action,
      name: task.name,
      values: task.instructions,
      groupName: group,
      result: null,
      input: task.input,
      endpoint: task.endpoint,
      rackPosition: task.rackPosition
    };
    return card;

  }

  move(step: number) {
    this.isTaskRunning = true;
    if (step < 0) {
      this.idx = (this.idx + this.cards.length + step) % this.cards.length;
    } else {
      if (this.idx === 0 || this.cards[this.idx].action === 'getnewrunid') {
        this.automationService.newRun(this.station).subscribe(res => {
          if (this.cards[this.idx].action === 'getnewrunid') {
            this.stationsService.finishedMBR(this.station, this.runId).subscribe();
          }
          this.runId = res.runId;
          this.isTaskRunning = false;
          this.idx = (this.idx + step) % this.cards.length;
          this.checkInputsToEnable();
          this.inputText.setValue(null);
        });
      } else {
        if (this.cards[this.idx].action) {
          this.automationService.launcAutomation(this.cards[this.idx].action).subscribe(
            code => this.automationService.checkRunning(code.res).subscribe(res => {
              if (res.status) {
                this.automationService.stopPolling();
                this.logTask(res.res);
              } else {
                this.taskMessage = res.res;
              }
            },
              msg => {
                window.alert(msg.error);
                this.automationService.stopPolling();
                this.isTaskRunning = false;
              }),
            msg => {
              this.isTaskRunning = false;
              window.alert(msg.message);
            });
        } else {
          this.logTask();
        }
      }
    }
  }

  checkInputsToEnable() {
    if (this.cards[this.idx].values) {
      this.readBarcode = this.cards[this.idx].input === 'barcode';
      this.readSenderID = this.cards[this.idx].input === 'sender';
      this.hasInput = this.cards[this.idx].input ? true : false;
    } else {
      this.readBarcode = false;
      this.readSenderID = false;
    }
    if (this.readBarcode) {
      this.inputText.updateValueAndValidity();
    }
  }

  logTask(automationResult = null): void {
    this.cards[this.idx].result = automationResult;
    if (this.readSenderID) {
      this.senderID = this.inputText.value;
    }
    if (this.hasInput) {
      if (this.readBarcode) {
        this.cards[this.idx].result = this.senderID && this.cards[this.idx].endpoint.indexOf('input') >= 0 ?
         this.senderID + '-' + this.inputText.value : this.inputText.value;
      } else {
        this.cards[this.idx].result = this.inputText.value;
      }
    }
    this.addExecutedTask();
  }

  addExecutedTask() {
    this.automationService.addexecutedTaskToRun(this.station, this.runId, this.cards[this.idx]).subscribe(
      () => {
        this.idx = (this.idx + 1) % this.cards.length;
        if (this.idx === 0) {
          this.stationsService.finishedMBR(this.station, this.runId).subscribe(() => this.runId = '');
        }
        this.isTaskRunning = false;
        this.checkInputsToEnable();
        this.inputText.setValue(null);
        document.getElementById((this.cards[this.idx].groupName + this.cards[this.idx].name).split(' ').join('')).scrollIntoView({ behavior: 'smooth' });
      },
      msg => {
        window.alert(msg.error);
        this.isTaskRunning = false;
      });
  }

  closeRun() {
    this.isTaskRunning = true;
    this.stationsService.finishedMBR(this.station, this.runId).subscribe(() => {
      this.runId = '';
      this.idx = 0;
      this.isTaskRunning = false;
    });
  }

  pauseAutomation() {
    this.automationService.pauseAutomation().subscribe();
  }

  resumeAutomation() {
    this.automationService.resumeAutomation().subscribe();
  }

  changeSenderId() {
    const dialogRef = this.dialog.open(SenderIDDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.senderID = result;
      }
    });
  }

}


@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: 'calibration-dialog.html',
})
export class CalibrationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CalibrationDialogComponent>
  ) { }

  close(): void {
    this.dialogRef.close(true);
  }
}

@Component({
  selector: 'app-senderid-dialog',
  templateUrl: 'senderid-dialog.html',
})
export class SenderIDDialogComponent {
  senderID: string;

  constructor(
    public dialogRef: MatDialogRef<SenderIDDialogComponent>
  ) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
