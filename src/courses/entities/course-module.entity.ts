import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { CourseContentType } from '../course-type.enum';
import { Course } from './course.entity';
import { CourseContent } from './course-content.entity';

@Entity()
export class CourseModule extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'content_url'
  })
  contentUrl: string;

  @Column({
    type: 'enum',
    name: 'content_url',
    enum: CourseContentType,
    default: CourseContentType.VIDEO
  })
  contentType: CourseContentType;

  @ManyToOne(() => Course, (course: Course) => course.modules)
  course: Course;

  @OneToMany(() => CourseContent, (courseContent) => courseContent.courseModule)
  courseContents: CourseContent[];
}
