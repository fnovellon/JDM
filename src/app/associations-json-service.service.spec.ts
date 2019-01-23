import { TestBed } from '@angular/core/testing';

import { AssociationsJsonService } from './associations-json.service';

describe('AssociationsJsonServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssociationsJsonService = TestBed.get(AssociationsJsonService);
    expect(service).toBeTruthy();
  });
});
