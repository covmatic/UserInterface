import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import {AuthService} from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserIsLoggedGuard implements CanActivate {
  pathRedirect: string;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  private canResolve(state, isAuthenticated) {
    if (state.url === '/login') {
      if (isAuthenticated) {
        this.setUrlRedirect('/stations');
        return false;
      } else {
        return true;
      }

    } else {
      if (isAuthenticated) {
        return true;
      } else {
        this.setUrlRedirect('/login');
        return false;
      }
    }
  }

  private checkifRedirect() {
    if (this.pathRedirect) {
      this.router.navigate([this.pathRedirect]);
      this.resetUrlRedirect();
    }
  }

  private setUrlRedirect(path: string) {
    this.pathRedirect = path;
  }

  private resetUrlRedirect() {
    this.pathRedirect = undefined;
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const isAuthenticated = this.authService.isAuthenticated();
    const canResolve = this.canResolve(state, isAuthenticated);

    this.checkifRedirect();
    return canResolve;

  }

  canActivateChild(next: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(next, state);
  }

}
