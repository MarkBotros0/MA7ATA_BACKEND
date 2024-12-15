import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Course } from '../entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly usersService: UsersService
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    teacherId: number
  ): Promise<Course> {
    const teacher: User = await this.usersService.findTeacherById(teacherId);

    const course: Course = this.courseRepository.create();
    Object.assign(course, createCourseDto);

    return this.courseRepository.save({
      ...course,
      teacher
    });
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['courseSections.courseContents', 'teacher']
    });
  }

  async findOne(id: number): Promise<Course> {
    const course: Course = await this.courseRepository.findOne({
      relations: ['courseSections.courseContents', 'teacher'],
      where: { id }
    });
    if (!course) {
      throw new NotFoundException(`Course with id: ${id} not found`);
    }
    return course;
  }

  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
    teacherId?: number
  ): Promise<Course> {
    const course: Course = await this.findOne(id);
    this.checkCourseOwnership(teacherId, course);
    Object.assign(course, updateCourseDto);
    await this.courseRepository.save(course);
    return this.findOne(course.id);
  }

  async remove(id: number, teacherId?: number): Promise<void> {
    const course: Course = await this.findOne(id);
    this.checkCourseOwnership(teacherId, course);
    await this.courseRepository.remove(course);
  }

  checkCourseOwnership(teacherId: number, course: Course): void {
    if (teacherId && teacherId != course.teacher.id) {
      throw new BadRequestException(
        `Teacher must be the owner of this course to update, edit, delete.`
      );
    }
  }
}
