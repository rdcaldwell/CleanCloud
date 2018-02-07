import { TestBed, inject } from '@angular/core/testing';

import { InstancesService } from './instances.service';

describe('InstancesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstancesService]
    });
  });

  it('should be created', inject([InstancesService], (service: InstancesService) => {
    expect(service).toBeTruthy();
  }));
});
