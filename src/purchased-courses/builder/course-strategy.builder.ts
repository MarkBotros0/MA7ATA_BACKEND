import { PurchaseCourseStrategy } from '../strategies/purchase-course.strategy';
import { CourseStrategy } from '../strategies/course.strategy';

export class CourseStrategyBuilder {
  buildStrategy(): CourseStrategy {
    return new PurchaseCourseStrategy();
  }
}
