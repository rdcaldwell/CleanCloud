import { TestBed, inject } from '@angular/core/testing';

import { SimianArmyService } from './simianarmy.service';

describe('SimianArmyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimianArmyService]
    });
  });

  it('should be created', inject([SimianArmyService], (service: SimianArmyService) => {
    expect(service).toBeTruthy();
  }));
});
