import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Course } from '../entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseSection } from '../entities/course-module.entity';
import { CoursesService } from './courses.service';
import { CreateCourseSectionDto } from '../dto/create-course-section.dto';

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
    teacherId: number
  ): Promise<CourseSection> {
    const course: Course = await this.coursesService.findOne(courseId);

    this.coursesService.checkCourseOwnership(teacherId, course);

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

  async findOne(id: number, teacherId?: number): Promise<CourseSection> {
    const courseSection: CourseSection =
      await this.courseSectionRepository.findOne({
        relations: ['courseContents', 'course.teacher'],
        where: { id }
      });
    if (!courseSection) {
      throw new NotFoundException(`Course Module with id: ${id} not found`);
    }
    this.coursesService.checkCourseOwnership(teacherId, courseSection.course);
    return courseSection;
  }

  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
    teacherId?: number
  ): Promise<CourseSection> {
    const courseSection: CourseSection = await this.findOne(id, teacherId);
    this.coursesService.checkCourseOwnership(teacherId, courseSection.course);
    Object.assign(courseSection, updateCourseDto);
    await this.courseSectionRepository.save(courseSection);
    return this.findOne(courseSection.id);
  }

  async remove(id: number, teacherId?: number): Promise<void> {
    const courseSection: CourseSection = await this.findOne(id, teacherId);
    this.coursesService.checkCourseOwnership(teacherId, courseSection.course);
    await this.courseSectionRepository.remove(courseSection);
  }
}
