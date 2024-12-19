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

  async findInstructorById(id: number): Promise<User> {
    const instructor: User = await this.usersRepository
      .createQueryBuilder('user')
      .where('FIND_IN_SET(:role, user.userRoles) > 0', {
        role: UserRole.INSTRUCTOR
      })
      .andWhere('user.id = :id', { id })
      .getOne();

    if (!instructor) {
      throw new NotFoundException(`Instructor with id: ${id} is not found`);
    }

    return instructor;
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

  async addInstructorRoleToUser(userId: number) {
    const user: User = await this.findOneById(userId);
    user.userRoles.push(UserRole.INSTRUCTOR);
    return this.usersRepository.save(user);
  }

  async getInstructorsForAdmin(): Promise<User[]> {
    return this.usersRepository.find({
      where: { userRoles: UserRole.INSTRUCTOR }
    });
  }

  async isInstructor(user: number | User): Promise<boolean> {
    if (typeof user === 'number') {
      const foundUser: User = await this.findOneById(user);
      return foundUser.userRoles.includes(UserRole.INSTRUCTOR);
    }
    return user.userRoles.includes(UserRole.INSTRUCTOR);
  }
}
