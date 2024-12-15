import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/user-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async findOneByPhoneNumber(phoneNumber: string): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { phoneNumber }
    });

    if (!user)
      throw new NotFoundException(
        `User with phoneNumber: ${phoneNumber} is not found`
      );

    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user: User = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} is not found`);
    }
    return user;
  }

  async findTeacherById(id: number): Promise<User> {
    const teacher: User = await this.usersRepository
      .createQueryBuilder('user')
      .where('FIND_IN_SET(:role, user.userRoles) > 0', {
        role: UserRole.TEACHER
      })
      .andWhere('user.id = :id', { id })
      .getOne();

    if (!teacher) {
      throw new NotFoundException(`Teacher with id: ${id} is not found`);
    }

    return teacher;
  }

  async create(
    phoneNumber: string,
    data?: Partial<Omit<User, 'phoneNumber'>>
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { phoneNumber } });

    if (user) {
      throw new BadRequestException(
        `User with phone number ${phoneNumber} is already registered`
      );
    }

    return this.usersRepository.save({ phoneNumber, ...data });
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(userId);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async addTeacherRoleToUser(userId: number) {
    const user: User = await this.findOneById(userId);
    user.userRoles.push(UserRole.TEACHER);
    return this.usersRepository.save(user);
  }

  async getTeachersForAdmin(): Promise<User[]> {
    return this.usersRepository.find({
      where: { userRoles: UserRole.TEACHER }
    });
  }

  async isTeacher(user: number | User): Promise<boolean> {
    if (typeof user === 'number') {
      const foundUser: User = await this.findOneById(user);
      return foundUser.userRoles.includes(UserRole.TEACHER);
    }
    return user.userRoles.includes(UserRole.TEACHER);
  }
}
