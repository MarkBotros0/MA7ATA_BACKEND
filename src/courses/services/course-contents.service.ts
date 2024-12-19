import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseSection } from '../entities/course-section.entity';
import { CourseContent } from '../entities/course-content.entity';
import { CoursesService } from './courses.service';
import { CourseSectionsService } from './course-sections.service';
import { CreateCourseContentDto } from '../dto/create-course-content.dto';
import { UpdateCourseContentDto } from '../dto/update-course-content.dto';

@Injectable()
export class CourseContentsService {
  constructor(
    @InjectRepository(CourseContent)
    private readonly courseContentRepository: Repository<CourseContent>,
    private readonly courseSectionsService: CourseSectionsService,
    private readonly coursesService: CoursesService
  ) {}

  async create(
    courseSectionId: number,
    createCourseContentDto: CreateCourseContentDto,
    instructorId: number
  ): Promise<CourseContent> {
    const courseSection: CourseSection =
      await this.courseSectionsService.findOne(courseSectionId);

    this.coursesService.checkCourseOwnership(
      instructorId,
      courseSection.course
    );

    const courseContent: CourseContent = this.courseContentRepository.create();
    Object.assign(courseContent, createCourseContentDto);
    return await this.courseContentRepository.save({
      ...courseContent,
      courseSection
    });
  }

  async findByCourseSectionId(
    courseSectionId: number
  ): Promise<CourseContent[]> {
    const courseSection: CourseSection =
      await this.courseSectionsService.findOne(courseSectionId);
    return this.courseContentRepository.find({
      relations: ['courseSection.course.instructor'],
      where: {
        courseSection: { id: courseSection.id }
      }
    });
  }

  async findOne(id: number, instructorId?: number): Promise<CourseContent> {
    const courseContent: CourseContent =
      await this.courseContentRepository.findOne({
        relations: ['courseSection.course.instructor'],
        where: { id }
      });
    if (!courseContent) {
      throw new NotFoundException(`Course Content with id: ${id} not found`);
    }
    this.coursesService.checkCourseOwnership(
      instructorId,
      courseContent.courseSection.course
    );
    return courseContent;
  }

  async update(
    id: number,
    updateCourseContentDto: UpdateCourseContentDto,
    instructorId?: number
  ): Promise<CourseContent> {
    const courseContent: CourseContent = await this.findOne(id, instructorId);
    this.coursesService.checkCourseOwnership(
      instructorId,
      courseContent.courseSection.course
    );
    Object.assign(courseContent, updateCourseContentDto);
    await this.courseContentRepository.save(courseContent);
    return this.findOne(courseContent.id);
  }

  async remove(id: number, instructorId?: number): Promise<void> {
    const courseContent: CourseContent = await this.findOne(id, instructorId);
    this.coursesService.checkCourseOwnership(
      instructorId,
      courseContent.courseSection.course
    );
    await this.courseContentRepository.remove(courseContent);
  }
}
