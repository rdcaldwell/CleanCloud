import { FormsModule } from '@angular/forms';
import { AmazonWebService } from './amazonweb.service';
import { TestBed, async, inject, tick } from '@angular/core/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('AmazonWebService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpModule
      ],
      providers: [
        AmazonWebService,
        { provide: XHRBackend, useClass: MockBackend }
      ],
    });
  });

  it('should be created', inject([AmazonWebService], (service: AmazonWebService) => {
    expect(service).toBeTruthy();
  }));

});
