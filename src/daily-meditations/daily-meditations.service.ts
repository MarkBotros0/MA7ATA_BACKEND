import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDailyMeditationDto } from './dto/create-daily-meditation.dto';
import { UpdateDailyMeditationDto } from './dto/update-daily-meditation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyMeditation } from './entities/daily-meditation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DailyMeditationsService {
  constructor(
    @InjectRepository(DailyMeditation)
    private readonly dailyMeditationRepository: Repository<DailyMeditation>
  ) {}

  async create(
    createDailyMeditationDto: CreateDailyMeditationDto
  ): Promise<DailyMeditation> {
    const dailyMeditation: DailyMeditation =
      this.dailyMeditationRepository.create();
    Object.assign(dailyMeditation, createDailyMeditationDto);
    return await this.dailyMeditationRepository.save(dailyMeditation);
  }

  async findAll(): Promise<DailyMeditation[]> {
    return this.dailyMeditationRepository.find();
  }

  async findOneById(id: number): Promise<DailyMeditation> {
    const dailyMeditation: DailyMeditation =
      await this.dailyMeditationRepository.findOne({ where: { id } });

    if (!dailyMeditation) {
      throw new NotFoundException(`DailyMeditation with id: ${id} not found`);
    }

    return dailyMeditation;
  }

  async update(id: number, updateDailyMeditationDto: UpdateDailyMeditationDto) {
    const dailyMeditation: DailyMeditation = await this.findOneById(id);

    Object.assign(dailyMeditation, updateDailyMeditationDto);
    await this.dailyMeditationRepository.save(dailyMeditation);

    return this.findOneById(dailyMeditation.id);
  }

  async remove(id: number): Promise<void> {
    const dailyMeditation: DailyMeditation = await this.findOneById(id);
    await this.dailyMeditationRepository.remove(dailyMeditation);
  }
}
