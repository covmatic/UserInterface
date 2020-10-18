import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { timer, Subject } from 'rxjs';
import { switchMap,  retry, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutomationService {
  private poll = new Subject();

  constructor(
    private http: HttpClient,
  ) { }

  launcAutomation(action) {
    return this.http
    .get<{res: string}>(environment.localApiBaseUrl + '/' + action);
  }

  pauseAutomation() {
    return this.http
    .get<{res: string}>(environment.localApiBaseUrl + '/pause');
  }

  resumeAutomation() {
    return this.http
    .get<{res: string}>(environment.localApiBaseUrl + '/resume');
  }

  checkRunning(id?: string) {
    return timer(1, 3000).pipe(
      switchMap(() => this.http.get<{status: boolean; res: any}>(environment.localApiBaseUrl + '/check')),
      takeUntil(this.poll));
  }

  stopPolling() {
    this.poll.next();
  }

  newRun(station: string) {
    return this.http
    .post<{runId: string}>(environment.apiBaseUrl + '/mbr/' + station , []);
  }

  addexecutedTaskToRun(station: string, runId: string, task) {
    return this.http
    .patch<{success: boolean}>(environment.apiBaseUrl + '/mbr/partial/' + station + '/' + runId, task);
  }
}
