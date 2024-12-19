import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { CourseContentType } from '../enums/course-type.enum';
import { CourseSection } from './course-module.entity';

@Entity()
export class CourseContent extends BaseEntity {
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
    name: 'content_url',
    nullable: true
  })
  contentUrl: string;

  @Column({
    type: 'enum',
    name: 'content_type',
    enum: CourseContentType,
    default: CourseContentType.VIDEO
  })
  contentType: CourseContentType;

  @ManyToOne(
    () => CourseSection,
    (courseSection) => courseSection.courseContents,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'course_section_id' })
  courseSection: CourseSection;
}
