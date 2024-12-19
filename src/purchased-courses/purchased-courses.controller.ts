import { Controller } from '@nestjs/common';
import { PurchasedCoursesService } from './purchased-courses.service';
import { User } from '../users/entities/user.entity';

@Controller('purchased-courses')
export class PurchasedCoursesController {
  constructor(
    private readonly purchasedCoursesService: PurchasedCoursesService
  ) {}

  async addCourseToUser(user: User) {}
}
