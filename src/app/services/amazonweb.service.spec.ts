import { TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AmazonWebService } from './amazonweb.service';
import { Http } from '@angular/http';

describe('AmazonWebService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      providers: [AmazonWebService]
    });
  });

  it('should be created', inject([AmazonWebService], (service: AmazonWebService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created',  inject([AmazonWebService], (service: AmazonWebService) => {
    service.getJanitors().subscribe(value => {
      expect(value).toBe('observable value');
    });
  }));
});
