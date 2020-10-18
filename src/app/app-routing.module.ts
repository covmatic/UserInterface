import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowStepsComponent } from './show-steps/show-steps.component';
import { ButtonSelectionComponent } from './button-selection/button-selection.component';
import { TableTabsComponent } from './table-tabs/table-tabs.component';
import { LoginComponent } from './login/login.component';
import { UserIsLoggedGuard } from './user-is-logged.guard';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent, pathMatch: 'full'}
  , {path: '', pathMatch: 'full', redirectTo: '/stations'}
  , { path: 'stations', component: ButtonSelectionComponent, canActivate: [UserIsLoggedGuard]}
  , { path: 'station/:protocol/:station', component: ShowStepsComponent, canActivate: [UserIsLoggedGuard] }
  , { path: 'dashboard', component: TableTabsComponent, canActivate: [UserIsLoggedGuard] }
  , { path: 'users', component: UsersComponent, canActivate: [UserIsLoggedGuard] }

  , {path: '**', redirectTo: '/stations'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
