import { Test, TestingModule } from '@nestjs/testing';
import { DailyMeditationsService } from './daily-meditations.service';

describe('DailyMeditationsService', () => {
  let service: DailyMeditationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyMeditationsService]
    }).compile();

    service = module.get<DailyMeditationsService>(DailyMeditationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
