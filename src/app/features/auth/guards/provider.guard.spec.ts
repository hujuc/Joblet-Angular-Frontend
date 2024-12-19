import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { providerGuard } from './provider.guard';

describe('providerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => providerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
