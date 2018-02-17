import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CostComponent } from './cost/cost.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HeaderComponent } from './header/header.component';
import { AmazonWebService } from './services/amazonweb.service';
import { AnalyticsService } from './services/analytics.service';
import { LoginComponent } from './login/login.component';
import { ActivateService } from './services/activate.service';
import { AuthenticationService } from './services/authentication.service';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ClusterComponent } from './cluster/cluster.component';
import { Ec2Component } from './ec2/ec2.component';
import { EfsComponent } from './efs/efs.component';
import { RdsComponent } from './rds/rds.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [ActivateService] }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CostComponent,
    AnalyticsComponent,
    HeaderComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    ClusterComponent,
    EfsComponent,
    RdsComponent,
    Ec2Component
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    AmazonWebService,
    AnalyticsService,
    AuthenticationService,
    ActivateService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
