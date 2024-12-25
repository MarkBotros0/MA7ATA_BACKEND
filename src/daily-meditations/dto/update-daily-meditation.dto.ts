import { PartialType } from '@nestjs/swagger';
import { CreateDailyMeditationDto } from './create-daily-meditation.dto';

export class UpdateDailyMeditationDto extends PartialType(
  CreateDailyMeditationDto
) {}
