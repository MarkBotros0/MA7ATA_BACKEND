import * as _ from 'lodash';
import { Course } from '../entities/course.entity';
import { CourseSectionView } from './course-section.view';
import { UserView } from '../../users/views/user.view';

export class CourseView {
  constructor(
    private readonly data: Course | Course[],
    private isPublic: boolean = true
  ) {}

  render() {
    if (Array.isArray(this.data)) {
      return this.data.map((course) => this.renderCourse(course));
    }
    return this.renderCourse(this.data);
  }

  private renderCourse(course: Course): any {
    const courseData = _.pick(course, ['id', 'title', 'description']);

    return {
      ...courseData,
      courseSections: new CourseSectionView(
        course.courseSections || [],
        this.isPublic
      ).render(),
      instructor: new UserView(course.instructor).render()
    };
  }
}
