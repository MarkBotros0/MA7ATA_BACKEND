import { Course } from '../entities/course.entity';
import { CourseSectionView } from './course-section.view';
import { UserView } from '../../users/views/user.view';

export class CourseView {
  constructor(
    private readonly data: Course | Course[],
    private isAuthorized: boolean = true
  ) {}

  render() {
    if (Array.isArray(this.data)) {
      return this.data.map((course) => this.renderCourse(course));
    }
    return this.renderCourse(this.data);
  }

  private renderCourse(course: Course): any {
    const courseData: Partial<Course> = {
      id: course.id,
      title: course.title,
      description: course.description,
      createdAt: course.createdAt,
      price: course.price
    };

    return {
      ...courseData,
      courseSections: new CourseSectionView(
        course.courseSections || [],
        this.isAuthorized
      ).render(),
      instructor: new UserView(course.instructor).render()
    };
  }
}
