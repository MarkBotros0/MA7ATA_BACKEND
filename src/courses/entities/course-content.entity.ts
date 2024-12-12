import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { CourseContentType } from '../course-type.enum';
import { CourseModule } from './course-module.entity';

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

  @ManyToOne(() => CourseModule, (courseModule) => courseModule.courseContents)
  courseModule: CourseModule;
}
