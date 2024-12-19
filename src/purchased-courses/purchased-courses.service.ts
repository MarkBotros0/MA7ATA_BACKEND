import { Injectable } from '@nestjs/common';
import { PurchasedCourse } from './entities/purchased-course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseStrategyBuilder } from './builder/course-strategy.builder';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/services/courses.service';

@Injectable()
export class PurchasedCoursesService {
  constructor(
    @InjectRepository(PurchasedCourse)
    private readonly purchasedCourseRepository: Repository<PurchasedCourse>,
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService
  ) {}

  async purchaseCourse(
    userId: number,
    courseId: number
  ): Promise<PurchasedCourse> {
    const [user, course] = await Promise.all([
      await this.usersService.findOneById(userId),
      await this.coursesService.findOne(courseId)
    ]);

    const strategy = new CourseStrategyBuilder().buildStrategy();

    return await strategy.addCourseToUser(user, course);
  }
}
