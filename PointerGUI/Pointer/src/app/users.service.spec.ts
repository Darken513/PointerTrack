import { TestBed } from '@angular/core/testing';

import { HttpServiceCustom } from './users.service';

describe('UsersService', () => {
  let service: HttpServiceCustom;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpServiceCustom);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
