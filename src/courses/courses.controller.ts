import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { CoursesService } from './services/courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { CourseView } from './views/course.view';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AdminOrInstructorGuard } from '../auth/guards/admin-or-instructor.guard';
import { CreateCourseSectionDto } from './dto/create-course-section.dto';
import { CourseSection } from './entities/course-module.entity';
import { CourseSectionView } from './views/course-section.view';
import { CourseSectionsService } from './services/course-sections.service';
import { UpdateCourseSectionDto } from './dto/update-course-section.dto';
import { InstructorId } from '../shared/decorators/instructor-id.decorator';

@Controller('courses')
@ApiBearerAuth()
@ApiTags('Courses')
@ApiSecurity('apiKey')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly courseSectionsService: CourseSectionsService
  ) {}

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Post()
  async createCourse(
    @InstructorId() instructorId: number,
    @Body() createCourseDto: CreateCourseDto
  ) {
    const course: Course = await this.coursesService.create(
      createCourseDto,
      instructorId
    );
    return new CourseView(course).render();
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll() {
    const courses: Course[] = await this.coursesService.findAll();
    return new CourseView(courses).render();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const course: Course = await this.coursesService.findOne(+id);
    return new CourseView(course).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto
  ) {
    const course: Course = await this.coursesService.update(
      +id,
      updateCourseDto
    );
    return new CourseView(course).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.coursesService.remove(+id);
    return { message: 'course deleted successfully' };
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Post(':courseId/course-sections')
  async createCourseSection(
    @InstructorId({ requiredForAdmin: false }) instructorId: number,
    @Param('courseId') courseId: number,
    @Body()
    createCourseSectionDto: CreateCourseSectionDto
  ) {
    const courseSection: CourseSection =
      await this.courseSectionsService.create(
        courseId,
        createCourseSectionDto,
        instructorId
      );
    return new CourseSectionView(courseSection).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Get(':courseId/course-sections')
  async getCourseSectionsByCourseId(@Param('courseId') courseId: number) {
    const courseSections: CourseSection[] =
      await this.courseSectionsService.findByCourseId(courseId);
    return new CourseSectionView(courseSections).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Get('course-sections/:courseSectionId')
  async getCourseSectionById(
    @InstructorId() instructorId: number,
    @Param('courseSectionId') courseSectionId: number
  ) {
    const courseSection: CourseSection =
      await this.courseSectionsService.findOne(courseSectionId, instructorId);
    return new CourseSectionView(courseSection).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Delete('course-sections/:courseSectionId')
  async deleteCourseSectionById(
    @InstructorId() instructorId: number,
    @Param('courseSectionId') courseSectionId: number
  ) {
    await this.courseSectionsService.remove(courseSectionId, instructorId);
    return { message: 'Course Section deleted successfully' };
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Patch('course-sections/:courseSectionId')
  async updateCourseSection(
    @InstructorId({ requiredForAdmin: false }) instructorId: number | undefined,
    @Param('courseSectionId')
    courseSectionId: number,
    @Body() updateCourseSectionDto: UpdateCourseSectionDto
  ) {
    await this.courseSectionsService.update(
      courseSectionId,
      updateCourseSectionDto,
      instructorId
    );
    return { message: 'Course Section deleted successfully' };
  }
}
