import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { CourseSection } from './course-module.entity';
import { User } from '../../users/entities/user.entity';

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

  @ManyToOne(() => User, (teacher) => teacher.courses, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @OneToMany(
    () => CourseSection,
    (courseSection: CourseSection) => courseSection.course,
    { cascade: true }
  )
  courseSections: CourseSection[];
}
