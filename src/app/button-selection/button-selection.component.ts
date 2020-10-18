import { Component, OnInit } from '@angular/core';

import { StationsService } from '../services/stations.service';

@Component({
  selector: 'app-button-selection',
  templateUrl: './button-selection.component.html',
  styleUrls: ['./button-selection.component.css']
})
export class ButtonSelectionComponent implements OnInit {
  protocols: {protocol: string, stations: {name: string, calibrated: boolean}[]}[];
  columns: number;
  constructor(
    private stationsService: StationsService,
  ) { }

  ngOnInit(): void {
    this.stationsService.getStations().subscribe(protocols => {
      this.columns = protocols.map(protocol => protocol.stations.length).reduce((prev, current) => (prev > current) ? prev : current) + 1;
      this.protocols = protocols;
    });
  }

  round(v: number): number{
    return Math.ceil(v / 6);
  }

}
