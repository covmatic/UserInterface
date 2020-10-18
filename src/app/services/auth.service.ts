import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Subject } from 'rxjs';

import {StorageService} from './storage.service';
import {AuthModel, AuthResponse} from '../models/auth.model';
import {WhoamiModel, WhoamiResponse} from '../models/whoami.model';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  authenticationUrl;
  authenticationBase64: string;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
    ) {
  }

  whoami(whoami: WhoamiResponse): WhoamiModel {
    return new WhoamiModel(whoami);
  }

  auth(auth: AuthResponse): AuthModel {
    return new AuthModel(auth);
  }

  login(username: string, password: string) {

    const observable = new Subject<any>();
    this.setCredentialBase64(this.getBase64ForBasicAuthentication(username, password));
    const authInfo = this.auth({access_token: this.authenticationBase64, valid: false}).getDataForStorage();
    this.storageService.setAuthInfo(authInfo);

    this.http.get<WhoamiResponse>(environment.apiBaseUrl + '/whoami').subscribe(response => {
        this.storageService.setAuthInfoValidation(true);
        const whoamiInfo = this.whoami(response).getDataForStorage();
        whoamiInfo.username = username;
        this.storageService.setWhoamiInfo(whoamiInfo);
        observable.next(authInfo);

      }, err => {
        this.logout();
        observable.error(err);
      }
    );
    return observable;
  }

  isAuthenticated(): boolean {
    const authInfo = this.storageService.getAuthInfo();
    return authInfo ? authInfo['valid'] : false;
  }

  getUserInfo() {
    return this.storageService.getWhoamiInfo();
  }

  private getBase64ForBasicAuthentication(username: string, password: string) {
    return btoa(username + ':' + password);
  }

  setCredentialBase64(token: string) {
    this.authenticationBase64 = token;
  }

  logout() {
    this.storageService.removeLocalStorage();
  }
}
