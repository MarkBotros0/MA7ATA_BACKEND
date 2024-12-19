import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { PurchasedCourse } from './purchased-course.entity';

@Entity('course_progress')
export class CourseProgress extends BaseEntity {
  @OneToOne(
    () => PurchasedCourse,
    (purchasedCourse) => purchasedCourse.progress,
    {
      onDelete: 'CASCADE'
    }
  )
  purchasedCourse: PurchasedCourse;

  @Column({ type: 'float', default: 0.0, name: 'percentage_completed' })
  percentageCompleted: number;

  @Column({ type: 'boolean', default: false, name: 'is_completed' })
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'last_accessed' })
  lastAccessed: Date;

  @Column({ type: 'json', nullable: true, name: 'seen_content' })
  seenContent: number[];
}
