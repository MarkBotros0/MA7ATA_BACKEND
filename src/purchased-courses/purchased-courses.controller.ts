import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { PurchasedCoursesService } from './purchased-courses.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { NormalUserGuard } from '../auth/guards/normal-user.guard';
import { UserId } from '../shared/decorators/user-id.decorator';
import { PurchasedCourse } from './entities/purchased-course.entity';
import { PurchasedCourseView } from './views/purchased-course.view';

@Controller('purchased-courses')
export class PurchasedCoursesController {
  constructor(
    private readonly purchasedCoursesService: PurchasedCoursesService
  ) {}

  @Post(':courseId')
  @UseGuards(AccessTokenGuard, NormalUserGuard)
  async purchaseCourse(
    @UserId() userId: number,
    @Param('courseId') courseId: number
  ) {
    const purchasedCourse: PurchasedCourse =
      await this.purchasedCoursesService.purchaseCourse(userId, courseId);

    return new PurchasedCourseView(purchasedCourse).render();
  }
}
