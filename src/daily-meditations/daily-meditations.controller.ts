import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { DailyMeditationsService } from './daily-meditations.service';
import { CreateDailyMeditationDto } from './dto/create-daily-meditation.dto';
import { UpdateDailyMeditationDto } from './dto/update-daily-meditation.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { DailyMeditation } from './entities/daily-meditation.entity';
import { DailyMeditationView } from './views/daily-meditation.view';

@Controller('daily-meditations')
export class DailyMeditationsController {
  constructor(
    private readonly dailyMeditationsService: DailyMeditationsService
  ) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Post()
  async create(@Body() createDailyMeditationDto: CreateDailyMeditationDto) {
    const dailyMeditation: DailyMeditation =
      await this.dailyMeditationsService.create(createDailyMeditationDto);
    return new DailyMeditationView(dailyMeditation).render();
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll() {
    const dailyMeditations: DailyMeditation[] =
      await this.dailyMeditationsService.findAll();
    return new DailyMeditationView(dailyMeditations).render();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyMeditationsService.findOneById(+id);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDailyMeditationDto: UpdateDailyMeditationDto
  ) {
    const dailyMeditation: DailyMeditation =
      await this.dailyMeditationsService.update(+id, updateDailyMeditationDto);
    return new DailyMeditationView(dailyMeditation).render();
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.dailyMeditationsService.remove(+id);
    return { message: 'Daily Meditation deleted successfully' };
  }
}
