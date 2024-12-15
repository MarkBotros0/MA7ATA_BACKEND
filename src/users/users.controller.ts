import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserView } from './views/user.view';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
@ApiSecurity('apiKey')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Post(':userId/teacher')
  async addTeacherRoleToUser(@Param('userId') userId: number) {
    await this.usersService.addTeacherRoleToUser(userId);
    return { message: 'Teacher role added to user' };
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get('teachers')
  async addAllTeachers() {
    const users: User[] = await this.usersService.getTeachersForAdmin();
    return new UserView(users).render();
  }
}
