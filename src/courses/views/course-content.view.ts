import * as _ from 'lodash';
import { CourseContent } from '../entities/course-content.entity';

export class CourseContentView {
  constructor(private readonly data: CourseContent | CourseContent[]) {}

  render(): any {
    if (Array.isArray(this.data)) {
      return this.data.map((courseContent) =>
        this.renderCourseContent(courseContent)
      );
    }
    return this.renderCourseContent(this.data);
  }

  private renderCourseContent(courseContent: CourseContent): any {
    const courseContentData = _.pick(courseContent, [
      'id',
      'title',
      'description',
      'contentUrl',
      'contentType'
    ]);

    return {
      ...courseContentData
    };
  }
}
