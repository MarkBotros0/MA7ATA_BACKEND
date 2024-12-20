import { CourseContent } from '../entities/course-content.entity';

export class CourseContentView {
  constructor(
    private readonly data: CourseContent | CourseContent[],
    private isAuthorized: boolean = true
  ) {}

  render(): any {
    if (Array.isArray(this.data)) {
      return this.data.map((courseContent) =>
        this.renderCourseContent(courseContent)
      );
    }
    return this.renderCourseContent(this.data);
  }

  private renderCourseContent(courseContent: CourseContent): any {
    const courseContentData: Partial<CourseContent> = {
      id: courseContent.id,
      title: courseContent.title,
      description: courseContent.description,
      contentType: courseContent.contentType
    };

    return {
      ...courseContentData,
      ...(this.isAuthorized ? { contentUrl: courseContent.contentUrl } : {})
    };
  }
}
