import * as _ from 'lodash';
import { UserView } from '../../users/views/user.view';
import { PurchasedCourse } from '../entities/purchased-course.entity';
import { CourseView } from '../../courses/views/course.view';

export class PurchasedCourseView {
  constructor(private readonly data: PurchasedCourse | PurchasedCourse[]) {}

  render() {
    if (Array.isArray(this.data)) {
      return this.data.map((course) => this.renderPurchasedCourse(course));
    }
    return this.renderPurchasedCourse(this.data);
  }

  private renderPurchasedCourse(purchasedCourse: PurchasedCourse): any {
    const purchasedCourseData: Partial<PurchasedCourse> = {
      id: purchasedCourse.id,
      createdAt: purchasedCourse.createdAt
    };

    return {
      ...purchasedCourseData,
      course: new CourseView(purchasedCourse.course || [], true).render(),
      user: new UserView(purchasedCourse.user || []).render()
    };
  }
}
