import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuthenticationService} from './services/authentication.service';
import {MatSidenavModule} from '@angular/material';
import {HttpModule} from '@angular/http';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, SidebarComponent
      ],
      imports: [ MatSidenavModule, RouterTestingModule, HttpModule, HttpClientTestingModule,
        BrowserAnimationsModule],
      providers: [ AuthenticationService ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
});
