import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { CoursesModule } from '../courses.module';
import { CourseModule } from './course-module.entity';

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

  @OneToMany(
    () => CoursesModule,
    (courseModule: CourseModule) => courseModule.course
  )
  modules: CourseModule[];
}
