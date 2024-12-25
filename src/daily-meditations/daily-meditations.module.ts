import { Module } from '@nestjs/common';
import { DailyMeditationsService } from './daily-meditations.service';
import { DailyMeditationsController } from './daily-meditations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyMeditation } from './entities/daily-meditation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyMeditation])],
  controllers: [DailyMeditationsController],
  providers: [DailyMeditationsService]
})
export class DailyMeditationsModule {}
