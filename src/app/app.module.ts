import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InstanceComponent } from './instance/instance.component';
import { CostComponent } from './cost/cost.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HeaderComponent } from './header/header.component';
import { InstancesService } from './services/instances.service';
import { ContextService } from './services/context.service';
import { AnalyticsService } from './services/analytics.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ActivateService } from './services/activate.service';
import { AuthenticationService } from './services/authentication.service';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ClusterComponent } from './cluster/cluster.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [ActivateService] }
];

@NgModule({
  declarations: [
    AppComponent,
    InstanceComponent,
    CostComponent,
    AnalyticsComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    ClusterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    InstancesService,
    AnalyticsService,
    AuthenticationService,
    ActivateService,
    ContextService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
