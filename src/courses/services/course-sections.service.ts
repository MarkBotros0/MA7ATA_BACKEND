import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from '../entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseSection } from '../entities/course-section.entity';
import { CoursesService } from './courses.service';
import { CreateCourseSectionDto } from '../dtos/create-course-section.dto';
import { UpdateCourseSectionDto } from '../dtos/update-course-section.dto';

@Injectable()
export class CourseSectionsService {
  constructor(
    @InjectRepository(CourseSection)
    private readonly courseSectionRepository: Repository<CourseSection>,
    private readonly coursesService: CoursesService
  ) {}

  async create(
    courseId: number,
    createCourseSectionDto: CreateCourseSectionDto,
    instructorId: number
  ): Promise<CourseSection> {
    const course: Course = await this.coursesService.findOne(courseId);

    this.coursesService.checkCourseOwnership(instructorId, course);

    const courseSection: CourseSection = this.courseSectionRepository.create();
    Object.assign(courseSection, createCourseSectionDto);
    return await this.courseSectionRepository.save({
      ...courseSection,
      course
    });
  }

  async findByCourseId(courseId: number): Promise<CourseSection[]> {
    const course: Course = await this.coursesService.findOne(courseId);
    return this.courseSectionRepository.find({
      relations: ['courseContents'],
      where: {
        course: { id: course.id }
      }
    });
  }

  async findOne(id: number): Promise<CourseSection> {
    const courseSection: CourseSection =
      await this.courseSectionRepository.findOne({
        relations: ['courseContents', 'course.instructor'],
        where: { id }
      });
    if (!courseSection) {
      throw new NotFoundException(`Course Section with id: ${id} not found`);
    }
    return courseSection;
  }

  async update(
    id: number,
    updateCourseSectionDto: UpdateCourseSectionDto,
    instructorId?: number
  ): Promise<CourseSection> {
    const courseSection: CourseSection = await this.findOne(id);
    this.coursesService.checkCourseOwnership(
      instructorId,
      courseSection.course
    );
    Object.assign(courseSection, updateCourseSectionDto);
    await this.courseSectionRepository.save(courseSection);
    return this.findOne(courseSection.id);
  }

  async remove(id: number, instructorId?: number): Promise<void> {
    const courseSection: CourseSection = await this.findOne(id);
    this.coursesService.checkCourseOwnership(
      instructorId,
      courseSection.course
    );
    await this.courseSectionRepository.remove(courseSection);
  }
}
