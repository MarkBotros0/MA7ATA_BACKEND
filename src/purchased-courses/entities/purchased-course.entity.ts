import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { CourseProgress } from './course-progress.entity';

@Entity('purchased_courses')
export class PurchasedCourse extends BaseEntity {
  @ManyToOne(() => User, (user) => user.purchasedCourses, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Course, (course) => course.purchasedCourses, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  course: Course;

  @OneToOne(() => CourseProgress, (progress) => progress.purchasedCourse)
  progress: CourseProgress;
}
