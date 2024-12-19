import { Module } from '@nestjs/common';
import { CoursesService } from './services/courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CourseContent } from './entities/course-content.entity';
import { CourseSection } from './entities/course-module.entity';
import { CourseSectionsService } from './services/course-sections.service';
import { CoursesController } from './courses.controller';
import { UsersModule } from '../users/users.module';
import { CourseProgress } from '../purchased-courses/entities/course-progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      CourseSection,
      CourseContent,
      CourseProgress
    ]),
    UsersModule
  ],
  controllers: [CoursesController],
  providers: [CoursesService, CourseSectionsService]
})
export class CoursesModule {}
