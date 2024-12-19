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
import { CreateCourseContentDto } from './dto/create-course-content.dto';
import { CourseContentsService } from './services/course-contents.service';
import { CourseContent } from './entities/course-content.entity';
import { CourseContentView } from './views/course-content.view';
import { UpdateCourseContentDto } from './dto/update-course-content.dto';

@Controller('courses')
@ApiBearerAuth()
@ApiTags('Courses')
@ApiSecurity('apiKey')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly courseSectionsService: CourseSectionsService,
    private readonly courseContentsService: CourseContentsService
  ) {}

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Post()
  async createCourse(
    @InstructorId({ requiredForAdmin: true }) instructorId: number | undefined,
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
  async findAllCourses() {
    const courses: Course[] = await this.coursesService.findAll();
    return new CourseView(courses).render();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOneCourse(@Param('id') id: number) {
    const course: Course = await this.coursesService.findOne(+id);
    return new CourseView(course).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Patch(':id')
  async updateCourse(
    @InstructorId({ requiredForAdmin: false }) instructorId: number | undefined,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto
  ) {
    const course: Course = await this.coursesService.update(
      +id,
      updateCourseDto,
      instructorId
    );
    return new CourseView(course).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Delete(':id')
  async removeCourse(
    @InstructorId({ requiredForAdmin: false }) instructorId: number | undefined,
    @Param('id') id: string
  ) {
    await this.coursesService.remove(+id, instructorId);
    return { message: 'course deleted successfully' };
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Post(':courseId/sections')
  async createCourseSection(
    @InstructorId({ requiredForAdmin: false }) instructorId: number,
    @Param('courseId') courseId: number,
    @Body()
    createCourseSectionDto: CreateCourseSectionDto
  ) {
    const courseSection: CourseSection =
      await this.courseSectionsService.create(
        +courseId,
        createCourseSectionDto,
        instructorId
      );
    return new CourseSectionView(courseSection).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Get('sections/:sectionId')
  async getCourseSection(@Param('sectionId') sectionId: number) {
    const courseSection: CourseSection =
      await this.courseSectionsService.findOne(+sectionId);
    return new CourseSectionView(courseSection).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Get(':courseId/sections')
  async getSectionsByCourseId(@Param('courseId') courseId: number) {
    const courseSections: CourseSection[] =
      await this.courseSectionsService.findByCourseId(+courseId);
    return new CourseSectionView(courseSections).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Patch('sections/:sectionId')
  async updateCourseSection(
    @InstructorId({ requiredForAdmin: false }) instructorId: number | undefined,
    @Param('sectionId')
    sectionId: number,
    @Body() updateCourseSectionDto: UpdateCourseSectionDto
  ) {
    const courseSection: CourseSection =
      await this.courseSectionsService.update(
        +sectionId,
        updateCourseSectionDto,
        instructorId
      );
    return new CourseSectionView(courseSection).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Delete('sections/:sectionId')
  async deleteCourseSection(
    @InstructorId({ requiredForAdmin: false }) instructorId: number | undefined,
    @Param('sectionId') sectionId: number
  ) {
    await this.courseSectionsService.remove(+sectionId, instructorId);
    return { message: 'Course Section deleted successfully' };
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Post('sections/:sectionId/contents')
  async createCourseContent(
    @InstructorId({ requiredForAdmin: false }) instructorId: number,
    @Param('sectionId') sectionId: number,
    @Body()
    createCourseContentDto: CreateCourseContentDto
  ) {
    const courseContent: CourseContent =
      await this.courseContentsService.create(
        +sectionId,
        createCourseContentDto,
        instructorId
      );
    return new CourseContentView(courseContent).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Get('sections/:sectionId/contents')
  async getContentsBySectionId(
    @InstructorId({ requiredForAdmin: false }) instructorId: number | undefined,
    @Param('sectionId') sectionId: number
  ) {
    const courseContents: CourseContent[] =
      await this.courseContentsService.findByCourseSectionId(+sectionId);

    const isAdminOrOwnInstructor: boolean =
      !instructorId ||
      (courseContents.length &&
        instructorId === courseContents[0].courseSection.course.instructor.id);

    return new CourseContentView(
      courseContents,
      isAdminOrOwnInstructor
    ).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Get('contents/:contentId')
  async getCourseContent(
    @InstructorId({ requiredForAdmin: false }) instructorId: number | undefined,
    @Param('contentId') contentId: number
  ) {
    const courseContent: CourseContent =
      await this.courseContentsService.findOne(+contentId);

    const isAdminOrOwnInstructor: boolean =
      !instructorId ||
      instructorId === courseContent.courseSection.course.instructor.id;

    return new CourseContentView(
      courseContent,
      isAdminOrOwnInstructor
    ).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Patch('contents/:contentId')
  async updateCourseContent(
    @InstructorId({ requiredForAdmin: false }) instructorId: number | undefined,
    @Param('contentId')
    contentId: number,
    @Body() updateCourseContentDto: UpdateCourseContentDto
  ) {
    const courseContent: CourseContent =
      await this.courseContentsService.update(
        +contentId,
        updateCourseContentDto,
        instructorId
      );
    return new CourseContentView(courseContent).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrInstructorGuard)
  @Delete('contents/:contentId')
  async deleteCourseContent(
    @InstructorId({ requiredForAdmin: false }) instructorId: number | undefined,
    @Param('contentId') contentId: number
  ) {
    await this.courseContentsService.remove(+contentId, instructorId);
    return { message: 'Course Content deleted successfully' };
  }
}
