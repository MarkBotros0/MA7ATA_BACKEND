import { Entity, Column, ManyToOne } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity('course-progress')
export class CourseProgress extends BaseEntity {
  @ManyToOne(() => User, (user) => user.progress, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Course, (course) => course.progress, { onDelete: 'CASCADE' })
  course: Course;

  @Column({ type: 'float', default: 0.0 })
  percentageCompleted: number;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastAccessed: Date;
}
