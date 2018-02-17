import { TestBed, inject } from '@angular/core/testing';

import { AmazonWebService } from './amazonweb.service';

describe('AmazonWebService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmazonWebService]
    });
  });

  it('should be created', inject([AmazonWebService], (service: AmazonWebService) => {
    expect(service).toBeTruthy();
  }));
});
