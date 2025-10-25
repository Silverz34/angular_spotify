import { TestBed } from '@angular/core/testing';

import { PlayerData } from './player-data';

describe('PlayerData', () => {
  let service: PlayerData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
