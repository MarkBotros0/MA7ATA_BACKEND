import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-roles.enum';
import { User } from '../../users/entities/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class InstructorGuard implements CanActivate {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles: UserRole[] = request.user?.userRoles;
    const userId: number = request.user?.id;

    if (request.user && roles.includes(UserRole.INSTRUCTOR)) {
      request.instructor = await this.entityManager.findOne(User, {
        where: { id: userId, userRoles: UserRole.INSTRUCTOR }
      });
      request.isAdmin = false;
      return true;
    }

    return false;
  }
}
