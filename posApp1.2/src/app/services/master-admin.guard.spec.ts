import { TestBed } from '@angular/core/testing';

import { MasterAdminGuard } from './master-admin.guard';

describe('MasterAdminGuard', () => {
  let guard: MasterAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MasterAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
