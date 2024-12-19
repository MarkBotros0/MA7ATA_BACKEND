import * as _ from 'lodash';
import { CourseSection } from '../entities/course-module.entity';
import { CourseContentView } from './course-content.view';

export class CourseSectionView {
  constructor(
    private readonly data: CourseSection | CourseSection[],
    private isPublic: boolean = true
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
    const courseContentData = _.pick(courseSection, [
      'id',
      'title',
      'description'
    ]);

    return {
      ...courseContentData,
      courseContents: new CourseContentView(
        courseSection.courseContents || [],
        this.isPublic
      ).render()
    };
  }
}
