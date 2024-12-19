import { Module } from '@nestjs/common';
import { PurchasedCoursesService } from './purchased-courses.service';
import { PurchasedCoursesController } from './purchased-courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseProgress } from './entities/course-progress.entity';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [TypeOrmModule.forFeature([CourseProgress]), CoursesModule],
  controllers: [PurchasedCoursesController],
  providers: [PurchasedCoursesService]
})
export class PurchasedCoursesModule {}
