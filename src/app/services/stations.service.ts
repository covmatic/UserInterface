import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Instruction {
  name: string;
  notes?: Array<string>;
  isInput?: boolean;
}

export interface Task {
  name: string;
  instructions: Array<Instruction>;
  input?: string;
  endpoint?: string;
  action?: string;
  rackPosition?: string;
}

export interface Group {
  name: string;
  tasks: Array<Task>;
}

export interface Card {
  groupName: string;
  name: string;
  values: Array<Instruction>;
  action: string;
  operator?: string;
  timestamp?: string;
  result: any;
  input?: string;
  endpoint?: string;
  rackPosition?: string;
}


@Injectable({
  providedIn: 'root'
})
export class StationsService {

  constructor(
    private http: HttpClient,
  ) { }

  getStations() {
    return this.http
    .get<Array<{protocol: string, stations: {name: string, calibrated: boolean}[]}>>(environment.apiBaseUrl + '/stations');
  }

  getProtocolForStation(station: string) {
    return this.http
    .get<Array<Group>>(environment.apiBaseUrl + '/station/' + station);
  }

  stationHasBeenCalibrated(station) {
    return this.http
    .put(environment.apiBaseUrl + '/calibration/' + station, {});
  }

  stationIsCalibrated(station) {
    return this.http
    .get<boolean>(environment.apiBaseUrl + '/calibration/' + station);
  }

  getProtocol(protocol: string) {
    return this.http
    .get<Array<Group>>(environment.apiBaseUrl + '/protocol/' + protocol);
  }

  getTable(endpoint: string) {
    return this.http
    .get<Array<any>>(environment.apiBaseUrl + endpoint);
  }

  getResult(pcrbarcode: string, pcrposition: string) {
    return this.http
    .get<Array<any>>(environment.apiBaseUrl + '/results/' + pcrbarcode + '/' + pcrposition);
  }

  getMBR(endpoint: string, station: string, runId: string) {
    return this.http
    .get<Array<Card>>(environment.apiBaseUrl + endpoint + '/' + station + '/' + runId);
  }

  getValidator(runId: string) {
    return this.http
    .get<{validator: string, timestamp: string }>(environment.apiBaseUrl + '/mbr/validator/' + runId);
  }

  approveMBR(station: string, runId: string ) {
    return this.http
    .put(environment.apiBaseUrl + '/mbr/approve/' + station + '/' + runId, []);
  }

  finishedMBR(station: string, runId: string ) {
    return this.http
    .put(environment.apiBaseUrl + '/mbr/finish/' + station + '/' + runId, []);
  }
}
