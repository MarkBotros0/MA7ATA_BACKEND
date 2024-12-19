import { Controller } from '@nestjs/common';
import { PurchasedCoursesService } from './purchased-courses.service';

@Controller('purchased-courses')
export class PurchasedCoursesController {
  constructor(private readonly purchasedCoursesService: PurchasedCoursesService) {}
}
