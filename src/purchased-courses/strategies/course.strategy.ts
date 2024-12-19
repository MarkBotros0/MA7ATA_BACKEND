import { EntityManager, Repository } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { PurchasedCourse } from '../entities/purchased-course.entity';
import { BadRequestException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';

export abstract class CourseStrategy {
  @InjectEntityManager()
  protected entityManager: EntityManager;

  abstract canApply(course: Course, user: User): Promise<boolean>;

  async addCourseToUser(user: User, course: Course): Promise<PurchasedCourse> {
    const canApply: boolean = await this.canApply(course, user);
    if (!canApply) {
      throw new BadRequestException('Cannot apply this course to the user.');
    }
    try {
      return await this.entityManager.transaction(async (transactionalEM) => {
        const purchasedCourseRepo: Repository<PurchasedCourse> =
          transactionalEM.getRepository(PurchasedCourse);

        const purchasedCourse: PurchasedCourse = await purchasedCourseRepo.save(
          { user, course }
        );

        return purchasedCourseRepo.findOne({
          relations: [
            'course.courseSections.courseContents',
            'course.instructor'
          ],
          where: { id: purchasedCourse.id }
        });
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new BadRequestException(
        'An error occurred while adding the course to the user.'
      );
    }
  }
}
