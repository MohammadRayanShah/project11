import { TestBed } from '@angular/core/testing';

import { StackExchangeService } from './stack-exchange.service';

describe('StackExchangeService', () => {
  let service: StackExchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StackExchangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
