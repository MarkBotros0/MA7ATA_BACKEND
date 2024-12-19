import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { UserRole } from '../enums/user-roles.enum';
import { Gender } from '../enums/gender.enum';
import { BlacklistedRefreshToken } from '../../auth/entities/blacklisted-refresh-token.entity';
import { Course } from '../../courses/entities/course.entity';
import { CourseProgress } from '../../courses/entities/course-progress.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'phone_number', unique: true, type: 'varchar', length: 15 })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  fullname: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true
  })
  email: string;

  @Column({
    type: 'text',
    nullable: true
  })
  password: string;

  @Column({
    type: 'set',
    name: 'user_roles',
    enum: UserRole,
    default: [UserRole.NORMAL]
  })
  userRoles: UserRole[];

  @Column({
    type: 'set',
    name: 'gender',
    enum: Gender,
    nullable: true
  })
  gender: Gender;

  @Column({
    type: 'date',
    name: 'date_of_birth',
    nullable: true
  })
  dateOfBirth: Date;

  @OneToMany(() => BlacklistedRefreshToken, (token) => token.user, {
    cascade: true
  })
  blacklistedRefreshTokens: BlacklistedRefreshToken[];

  @OneToMany(() => Course, (course) => course.instructor)
  courses: Course[];

  @OneToMany(() => CourseProgress, (progress) => progress.user)
  progress: CourseProgress[];
}
