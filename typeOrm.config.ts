import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { OtpCode } from './src/auth/entities/otp-code.entity';
import { BlacklistedRefreshToken } from './src/auth/entities/blacklisted-refresh-token.entity';
import { Course } from './src/courses/entities/course.entity';
import { CourseSection } from './src/courses/entities/course-module.entity';
import { CourseContent } from './src/courses/entities/course-content.entity';
import { CourseProgress } from './src/purchased-courses/entities/course-progress.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.getOrThrow('MYSQL_HOST'),
  port: configService.getOrThrow('MYSQL_PORT'),
  database: configService.getOrThrow('MYSQL_DATABASE'),
  username: configService.getOrThrow('MYSQL_USERNAME'),
  password: configService.getOrThrow('MYSQL_PASSWORD'),
  migrations: ['./migrations/*.ts'],
  entities: [
    User,
    OtpCode,
    BlacklistedRefreshToken,
    Course,
    CourseSection,
    CourseContent,
    CourseProgress
  ],
  synchronize: false,
  logging: true
});
