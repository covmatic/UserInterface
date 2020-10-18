import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);

  }
}
