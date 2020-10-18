import { Injectable } from '@angular/core';
import {LocalStorageService} from 'angular-2-local-storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  private STORAGE_KEYS = {
    auth: 'auth',
    whoami: 'whoami',
    settings: 'settings'
  };

  constructor(private localStorageService: LocalStorageService) {
  }

  // Auth
  setAuthInfo(data) {
    this.localStorageService.set(this.STORAGE_KEYS.auth, data);
  }

  setAuthInfoValidation(valid: boolean) {
    const authInfo = this.getAuthInfo();
    if (authInfo !== null) {
      authInfo['valid'] = valid;
      this.localStorageService.set(this.STORAGE_KEYS.auth, authInfo);
    }
  }

  getAuthInfo() {
    const authInfo = this.localStorageService.get(this.STORAGE_KEYS.auth);
    return authInfo || null;
  }

  removeAuthInfo() {
    this.localStorageService.remove(this.STORAGE_KEYS.auth);
  }

  setWhoamiInfo(data) {
    this.localStorageService.set(this.STORAGE_KEYS.whoami, data);
  }

  getWhoamiInfo() {
    const authInfo = this.localStorageService.get(this.STORAGE_KEYS.whoami);
    return authInfo || null;
  }

  removeWhoamiInfo() {
    this.localStorageService.remove(this.STORAGE_KEYS.whoami);
  }

  setSettings(data) {
    this.localStorageService.set(this.STORAGE_KEYS.settings, data);
  }

  getSettings() {
    const authInfo = this.localStorageService.get(this.STORAGE_KEYS.settings);
    return authInfo || null;
  }

  removeSettingsInfo() {
    this.localStorageService.remove(this.STORAGE_KEYS.settings);
  }

  ifExistAuthInfoInStorage(): boolean {
    const authInfo = this.localStorageService.get(this.STORAGE_KEYS.auth);
    return !!authInfo;
  }

  removeLocalStorage() {
    this.removeAuthInfo();
    this.removeWhoamiInfo();
    this.removeSettingsInfo();
  }
}
