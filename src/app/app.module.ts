import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ClusterComponent } from './cluster/cluster.component';
import { Ec2Component } from './ec2/ec2.component';
import { EfsComponent } from './efs/efs.component';
import { RdsComponent } from './rds/rds.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { JanitorComponent } from './janitor/janitor.component';
import { JanitorDialogComponent } from './janitor/janitordialog/janitordialog.component';
import { MonitorComponent } from './monitor/monitor.component';
import { AmazonWebService } from './services/amazonweb.service';
import { AuthenticationService } from './services/authentication.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatInputModule,
  MatSelectModule,
  MatSidenavModule,
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
  MatDialogModule
} from '@angular/material';

const routes: Routes = [
  { path: '', redirectTo: 'instances', pathMatch: 'full' },
  { path: 'instances', component: DashboardComponent, canActivate: [AuthenticationService] },
  { path: 'monitor', component: MonitorComponent, canActivate: [AuthenticationService] },
  { path: 'janitor', component: JanitorComponent, canActivate: [AuthenticationService] },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthenticationService] }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AnalyticsComponent,
    HeaderComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    ClusterComponent,
    EfsComponent,
    RdsComponent,
    Ec2Component,
    SidebarComponent,
    JanitorComponent,
    MonitorComponent,
    JanitorDialogComponent
  ],
  entryComponents: [
    JanitorComponent,
    JanitorDialogComponent,
    Ec2Component,
    AnalyticsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    HttpClientModule,
    MomentModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatDialogModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    AmazonWebService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
