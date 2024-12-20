import { CourseSection } from '../entities/course-section.entity';
import { CourseContentView } from './course-content.view';

export class CourseSectionView {
  constructor(
    private readonly data: CourseSection | CourseSection[],
    private isAuthorized: boolean = true
  ) {}

  render(): any {
    if (Array.isArray(this.data)) {
      return this.data.map((courseContent) =>
        this.renderCourseSection(courseContent)
      );
    }
    return this.renderCourseSection(this.data);
  }

  private renderCourseSection(courseSection: CourseSection): any {
    const courseContentData: Partial<CourseSection> = {
      id: courseSection.id,
      title: courseSection.title,
      description: courseSection.description,
      createdAt: courseSection.createdAt
    };

    return {
      ...courseContentData,
      courseContents: new CourseContentView(
        courseSection.courseContents || [],
        this.isAuthorized
      ).render()
    };
  }
}
