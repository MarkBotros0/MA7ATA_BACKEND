import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ApiKeyMiddleware } from './auth/middlewares/apikey.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CoursesModule } from './courses/courses.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurchasedCoursesModule } from './purchased-courses/purchased-courses.module';
import { DailyMeditationsModule } from './daily-meditations/daily-meditations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    PurchasedCoursesModule,
    DailyMeditationsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(ApiKeyMiddleware)
      .exclude({ path: '', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
