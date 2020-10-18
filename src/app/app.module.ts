import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <== add the imports!

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModuleModule } from './material-module/material-module.module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ShowStepsComponent, SenderIDDialogComponent } from './show-steps/show-steps.component';
import { ButtonSelectionComponent } from './button-selection/button-selection.component';
import { TableTabsComponent } from './table-tabs/table-tabs.component';
import { TableEditViewComponent } from './table-edit-view/table-edit-view.component';
import { TableComponent } from './table/table.component';
import { LoginComponent } from './login/login.component';
import { LocalStorageModule } from 'angular-2-local-storage';
import { AuthInterceptor } from './http-interceptor/auth.interceptor';
import { MbrSumUpComponent } from './mbr-sum-up/mbr-sum-up.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ShowPcrResultComponent } from './show-pcr-result/show-pcr-result.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UsersComponent, UserDialogComponent } from './users/users.component';


@NgModule({
  declarations: [
    AppComponent,
    ShowStepsComponent,
    ButtonSelectionComponent,
    TableTabsComponent,
    TableEditViewComponent,
    TableComponent,
    LoginComponent,
    MbrSumUpComponent,
    ToolbarComponent,
    ShowPcrResultComponent,
    UsersComponent,
    UserDialogComponent,
    SenderIDDialogComponent
  ],
  imports: [
    NgxChartsModule,
    LocalStorageModule.forRoot({
      prefix: 'covid',
      storageType: 'localStorage'
  }),
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    MaterialModuleModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
