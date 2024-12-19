import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { CourseSection } from './course-module.entity';
import { User } from '../../users/entities/user.entity';
import { CourseProgress } from '../../purchased-courses/entities/course-progress.entity';

@Entity()
export class Course extends BaseEntity {
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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => User, (instructor) => instructor.courses, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'instructor_id' })
  instructor: User;

  @OneToMany(
    () => CourseSection,
    (courseSection: CourseSection) => courseSection.course
  )
  courseSections: CourseSection[];

  @OneToMany(() => CourseProgress, (progress) => progress.course)
  progress: CourseProgress[];
}
