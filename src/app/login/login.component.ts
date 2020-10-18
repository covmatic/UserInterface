import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../services/auth.service';

interface ModelFormLogin {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  login: ModelFormLogin = {username: undefined, password: undefined};
  loginFailedError: string;
  loginLoading: boolean;

  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
  }

  submitLogin(form: NgForm): void {
    this.resetLoginError();

    if (form.valid) {
      this.setLoading(true);
      this.authService.login(this.login.username, this.login.password).subscribe(res => {
          this.setLoading(false);
          this.router.navigate(['']);
        }, err => {
          this.setLoading(false);
          this.setLoginError(err.status);
        }
      );
    }
  }

  getErrorMessage(what: string): string {
    switch (what) {
      case 'required':
        return 'Required Field';
      case 'email':
        return 'Not a valid email';
      case 'authentication':
        return 'Wrong credential';
      case 'general-server':
        return 'General server error';
    }
  }

  setLoginError(what): void {
    switch (what) {
      case 401:
        this.loginFailedError = this.getErrorMessage('authentication');
        break;
      default:
        this.loginFailedError = this.getErrorMessage('general-server');
    }
  }

  resetLoginError(): void {
    this.loginFailedError = undefined;
  }

  setLoading(flag: boolean): void {
    this.loginLoading = flag;
  }
}
