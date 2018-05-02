import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule, MatDialogModule, MatTooltipModule } from '@angular/material';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ClustersComponent } from './clusters/clusters.component';
import { ClusterComponent } from './clusters/cluster/cluster.component';
import { Ec2Component } from './ec2/ec2.component';
import { EfsComponent } from './efs/efs.component';
import { RdsComponent } from './rds/rds.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { JanitorComponent } from './janitor/janitor.component';
import { JanitorDialogComponent } from './janitor/janitordialog/janitordialog.component';
import { MonitorComponent } from './monitor/monitor.component';
import { AmazonWebService } from './services/amazonweb.service';
import { AuthenticationService } from './services/authentication.service';
import { ClusterService } from './services/cluster.service';
import { JanitorService } from './services/janitor.service';
import { JenkinsService } from './services/jenkins.service';
import { JobService } from './services/job.service';
import { SimianArmyService } from './services/simianarmy.service';

const routes: Routes = [
  { path: '', redirectTo: 'instances', pathMatch: 'full' },
  { path: 'clusters', component: ClustersComponent, canActivate: [AuthenticationService] },
  { path: 'instances', component: DashboardComponent, canActivate: [AuthenticationService] },
  { path: 'monitor', component: MonitorComponent, canActivate: [AuthenticationService] },
  { path: 'janitor', component: JanitorComponent, canActivate: [AuthenticationService] },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthenticationService] },
  { path: '**', redirectTo: 'instances' },
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
    JanitorDialogComponent,
    ClustersComponent,
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
    MatSidenavModule,
    MatDialogModule,
    MatTooltipModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    AmazonWebService,
    AuthenticationService,
    ClusterService,
    JanitorService,
    JenkinsService,
    JobService,
    SimianArmyService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
