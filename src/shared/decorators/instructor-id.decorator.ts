import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common';
import { UserRole } from '../../users/enums/user-roles.enum';

export const InstructorId = createParamDecorator(
  (
    data: { requiredForAdmin?: boolean } = {},
    ctx: ExecutionContext
  ): number | undefined => {
    const requiredForAdmin: boolean = data?.requiredForAdmin ?? true;

    const request = ctx.switchToHttp().getRequest();

    if (request.user?.userRoles.includes(UserRole.INSTRUCTOR)) {
      return request.user.id;
    }

    if (!requiredForAdmin) {
      return undefined;
    }

    const instructorIdFromBody = request.body?.instructorId;
    if (instructorIdFromBody) {
      return instructorIdFromBody;
    }

    throw new BadRequestException(
      'Instructor role must be signed in or admin must add instructorId in the body.'
    );
  }
);
