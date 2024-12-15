import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { Course } from './course.entity';
import { CourseContent } from './course-content.entity';

@Entity()
export class CourseSection extends BaseEntity {
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

  @ManyToOne(() => Course, (course: Course) => course.courseSections, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(
    () => CourseContent,
    (courseContent) => courseContent.courseSection,
    { cascade: true }
  )
  courseContents: CourseContent[];
}
