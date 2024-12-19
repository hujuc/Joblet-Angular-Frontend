import { TestBed } from '@angular/core/testing';

import { MyServicesService } from './myservices.service';

describe('MyServices', () => {
  let service: MyServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
