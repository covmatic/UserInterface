import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private storageService: StorageService,
    private auth: AuthService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from the service.
    const authToken = this.storageService.getAuthInfo();
    const authReq = request.clone({
      headers: request.headers.set('Authorization', 'Basic ' + authToken['access_token'])
    });
    return next.handle(authReq);
  }
}
