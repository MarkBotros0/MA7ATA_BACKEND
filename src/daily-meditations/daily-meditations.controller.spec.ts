import { Test, TestingModule } from '@nestjs/testing';
import { DailyMeditationsController } from './daily-meditations.controller';
import { DailyMeditationsService } from './daily-meditations.service';

describe('DailyMeditationsController', () => {
  let controller: DailyMeditationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyMeditationsController],
      providers: [DailyMeditationsService]
    }).compile();

    controller = module.get<DailyMeditationsController>(
      DailyMeditationsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
