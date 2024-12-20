import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserView } from './views/user.view';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserId } from '../shared/decorators/user-id.decorator';

@Controller('users')
@ApiTags('users')
@ApiSecurity('apiKey')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Post(':userId/instructor')
  async addInstructorRoleToUser(@Param('userId') userId: number) {
    await this.usersService.addInstructorRoleToUser(userId);
    return { message: 'Instructor role added to user' };
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get('instructors')
  async addAllInstructors() {
    const users: User[] = await this.usersService.getInstructorsForAdmin();
    return new UserView(users).render();
  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  async updateProfile(
    @UserId() userId: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user: User = await this.usersService.update(userId, updateUserDto);
    return new UserView(user).render();
  }
}
