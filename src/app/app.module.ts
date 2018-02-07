import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { InstanceComponent } from './instance/instance.component';
import { CostComponent } from './cost/cost.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HeaderComponent } from './header/header.component';
import { InstancesService } from './services/instances.service';
import { AnalyticsService } from './services/analytics.service';

@NgModule({
  declarations: [
    AppComponent,
    InstanceComponent,
    CostComponent,
    AnalyticsComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [InstancesService, AnalyticsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
