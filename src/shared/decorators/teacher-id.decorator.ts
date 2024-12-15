import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common';
import { UserRole } from '../../users/enums/user-roles.enum';

export const TeacherId = createParamDecorator(
  (
    data: { requiredForAdmin?: boolean } = {},
    ctx: ExecutionContext
  ): number | undefined => {
    const requiredForAdmin: boolean = data?.requiredForAdmin ?? true;

    const request = ctx.switchToHttp().getRequest();

    if (request.user?.userRoles.includes(UserRole.TEACHER)) {
      return request.user.id;
    }

    if (!requiredForAdmin) {
      return undefined;
    }

    const teacherIdFromBody = request.body?.teacherId;
    if (teacherIdFromBody) {
      return teacherIdFromBody;
    }

    throw new BadRequestException(
      'Teacher role must be signed in or admin must add teacherId in the body.'
    );
  }
);
