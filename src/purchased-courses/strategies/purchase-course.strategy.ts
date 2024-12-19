import { CourseStrategy } from './course.strategy';
import { Course } from '../../courses/entities/course.entity';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { PurchasedCourse } from '../entities/purchased-course.entity';

export class PurchaseCourseStrategy extends CourseStrategy {
  constructor() {
    super();
  }

  override async canApply(course: Course, user: User): Promise<boolean> {
    const repository: Repository<PurchasedCourse> =
      this.entityManager.getRepository(PurchasedCourse);
    const existingCourse: PurchasedCourse = await repository.findOne({
      where: { course, user }
    });
    return !existingCourse;
  }
}
